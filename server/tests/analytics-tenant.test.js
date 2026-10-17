
jest.mock("../src/config/prisma", () => ({
  project: {
    findFirst: jest.fn(),
  },
}));

jest.mock("../src/config/redis", () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

const prisma = require("../src/config/prisma");
const redis = require("../src/config/redis");
const { getProjectAnalyticsService } = require("../src/services/analytics.service");

describe("Project analytics tenant isolation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("blocks access when the project belongs to another company", async () => {
    prisma.project.findFirst.mockResolvedValue(null);

    const result = await getProjectAnalyticsService(
      "company-b-project",
      { companyId: "company-a" },
      7
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe("Project not found");
    expect(prisma.project.findFirst).toHaveBeenCalledWith({
      where: {
        id: "company-b-project",
        companyId: "company-a",
      },
    });
    expect(redis.get).not.toHaveBeenCalled();
  });

  test("uses a company-specific analytics cache key", async () => {
    const project = {
      id: "project-a",
      companyId: "company-a",
      name: "Project A",
    };

    const cachedData = {
      project,
      totalEvents: 10,
      topEvents: [],
      recentEvents: [],
      eventsByDay: [],
    };

    prisma.project.findFirst.mockResolvedValue(project);
    redis.get.mockResolvedValue(JSON.stringify(cachedData));

    const result = await getProjectAnalyticsService(
      "project-a",
      { companyId: "company-a" },
      7
    );

    expect(result.success).toBe(true);
    expect(result.data).toEqual(cachedData);
    expect(redis.get).toHaveBeenCalledWith(
      "analytics:company:company-a:project:project-a:7"
    );
  });
});
