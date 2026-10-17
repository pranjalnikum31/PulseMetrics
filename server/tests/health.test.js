
process.env.JWT_SECRET = "test-secret";
process.env.RAZORPAY_WEBHOOK_SECRET = "webhook-test-secret";

jest.mock("../src/config/prisma", () => ({
  user: { findUnique: jest.fn() },
  company: {
    findUnique: jest.fn(),
    updateMany: jest.fn(),
  },
}));

jest.mock("../src/services/auth.service", () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

jest.mock("../src/services/project.service", () => ({
  createProjectService: jest.fn(),
  getAllProjectsService: jest.fn(),
  getProjectByIdService: jest.fn(),
  updateProjectService: jest.fn(),
  deleteProjectService: jest.fn(),
}));

jest.mock("../src/services/apiKey.service", () => ({
  createApiKeyService: jest.fn(),
  getAllApiKeysService: jest.fn(),
  updateApiKeyService: jest.fn(),
}));

jest.mock("../src/services/event.service", () => ({
  createEventService: jest.fn(),
  createServerEventService: jest.fn(),
}));

jest.mock("../src/services/analytics.service", () => ({
  getOverviewService: jest.fn(),
  getTopEventsService: jest.fn(),
  getRecentEventsService: jest.fn(),
  getEventsByDayService: jest.fn(),
  getProjectAnalyticsService: jest.fn(),
}));

jest.mock("../src/services/usage.service", () => ({
  checkUsageLimit: jest.fn(),
}));

jest.mock("../src/services/billing.service", () => ({
  createSubscription: jest.fn(),
}));

const request = require("supertest");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const app = require("../src/app");
const prisma = require("../src/config/prisma");

const authService = require("../src/services/auth.service");
const projectService = require("../src/services/project.service");
const apiKeyService = require("../src/services/apiKey.service");
const eventService = require("../src/services/event.service");
const analyticsService = require("../src/services/analytics.service");
const { checkUsageLimit } = require("../src/services/usage.service");
const { createSubscription } = require("../src/services/billing.service");

const user = {
  id: "user-test-id",
  companyId: "company-test-id",
  name: "Test User",
  role: "OWNER",
};

const token = (role = "OWNER") =>
  jwt.sign({ id: user.id }, process.env.JWT_SECRET);

const auth = (role = "OWNER") => ({
  Authorization: `Bearer ${token(role)}`,
});

beforeEach(() => {
  jest.clearAllMocks();

  prisma.user.findUnique.mockResolvedValue({
    ...user,
    role: "OWNER",
    password: "hashed-password",
  });

  prisma.company.findUnique.mockResolvedValue({
    id: user.companyId,
    name: "Test Company",
    plan: "FREE",
  });
});

describe("PulseMetrics API", () => {
  test("GET / returns the welcome message", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toContain("PulseMetrics API");
  });

  test("protected route rejects missing authorization", async () => {
    const res = await request(app).get("/api/projects");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(
      "Authorization header missing or invalid"
    );
  });

  test("protected route rejects an invalid token", async () => {
    const res = await request(app)
      .get("/api/projects")
      .set("Authorization", "Bearer invalid-token");

    expect(res.status).toBe(401);
  });

  test("owner route rejects a non-owner", async () => {
    prisma.user.findUnique.mockResolvedValue({
      ...user,
      role: "ADMIN",
      password: "hashed-password",
    });

    const res = await request(app)
      .get("/api/auth/owner")
      .set(auth());

    expect(res.status).toBe(403);
  });

  test("profile does not expose the user's password", async () => {
    const res = await request(app)
      .get("/api/auth/profile")
      .set(auth());

    expect(res.status).toBe(200);
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.company.plan).toBe("FREE");
  });

  test("login returns a failed status for invalid credentials", async () => {
    authService.login.mockResolvedValue({
      success: false,
      message: "Invalid credentials",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@example.com", password: "wrong" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("creates a project for an authorized user", async () => {
    projectService.createProjectService.mockResolvedValue({
      success: true,
      data: { id: "project-test-id", name: "Test Project" },
    });

    const res = await request(app)
      .post("/api/projects")
      .set(auth())
      .send({ name: "Test Project" });

    expect(res.status).toBe(201);
    expect(projectService.createProjectService).toHaveBeenCalled();
  });

  test("returns the user's projects", async () => {
    projectService.getAllProjectsService.mockResolvedValue({
      success: true,
      data: [],
    });

    const res = await request(app)
      .get("/api/projects")
      .set(auth());

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("creates an API key for an authorized user", async () => {
    apiKeyService.createApiKeyService.mockResolvedValue({
      success: true,
      data: { id: "key-test-id" },
    });

    const res = await request(app)
      .post("/api/api-keys")
      .set(auth())
      .send({ projectId: "project-test-id", name: "Test key" });

    expect(res.status).toBe(201);
  });

  test("rejects an event when the API key is invalid", async () => {
    eventService.createEventService.mockResolvedValue({
      success: false,
      message: "Invalid API key",
    });

    const res = await request(app)
      .post("/api/events")
      .set("x-api-key", "invalid-key")
      .send({ eventName: "page_view" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("rejects unsupported project analytics ranges", async () => {
    const res = await request(app)
      .get("/api/analytics/project/project-test-id?days=14")
      .set(auth());

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Days must be 7, 30, or 90");
    expect(analyticsService.getProjectAnalyticsService)
      .not.toHaveBeenCalled();
  });

  test("returns project analytics for a supported range", async () => {
    analyticsService.getProjectAnalyticsService.mockResolvedValue({
      success: true,
      data: { totalEvents: 10 },
    });

    const res = await request(app)
      .get("/api/analytics/project/project-test-id?days=7")
      .set(auth());

    expect(res.status).toBe(200);
    expect(analyticsService.getProjectAnalyticsService)
      .toHaveBeenCalledWith("project-test-id", expect.any(Object), 7);
  });

  test("returns usage for the authenticated company", async () => {
    checkUsageLimit.mockResolvedValue({
      usage: 100,
      limit: 10000,
      remaining: 9900,
    });

    const res = await request(app)
      .get("/api/usage")
      .set(auth());

    expect(res.status).toBe(200);
    expect(res.body.data.plan).toBe("FREE");
    expect(res.body.data.percentage).toBe(1);
  });

  test("creates a subscription for an authorized user", async () => {
    createSubscription.mockResolvedValue({
      id: "sub_test",
      plan_id: "plan_test",
      status: "created",
    });

    const res = await request(app)
      .post("/api/billing/subscription")
      .set(auth());

    expect(res.status).toBe(201);
    expect(res.body.data.subscriptionId).toBe("sub_test");
  });

  test("rejects a webhook with an invalid signature", async () => {
    const payload = JSON.stringify({ event: "subscription.activated" });

    const res = await request(app)
      .post("/api/billing/webhook")
      .set("Content-Type", "application/json")
      .set("x-razorpay-signature", "invalid-signature")
      .send(payload);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("accepts a correctly signed activation webhook", async () => {
    const payload = JSON.stringify({
      event: "subscription.activated",
      payload: {
        subscription: {
          entity: { id: "sub_test" },
        },
      },
    });

    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(Buffer.from(payload))
      .digest("hex");

    prisma.company.updateMany.mockResolvedValue({ count: 1 });

    const res = await request(app)
      .post("/api/billing/webhook")
      .set("Content-Type", "application/json")
      .set("x-razorpay-signature", signature)
      .send(payload);

    expect(res.status).toBe(200);
    expect(prisma.company.updateMany).toHaveBeenCalledWith({
      where: { razorpaySubscriptionId: "sub_test" },
      data: { plan: "PRO" },
    });
  });
});
