
jest.mock("../src/config/prisma", () => ({
  project: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const prisma = require("../src/config/prisma");
const {
  createProjectService,
  getAllProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
} = require("../src/services/project.service");

describe("Project tenant isolation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("lists only projects belonging to the current company", async () => {
    prisma.project.findMany.mockResolvedValue([]);

    await getAllProjectsService({ companyId: "company-a" });

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { companyId: "company-a" },
      })
    );
  });

  test("blocks access to another company's project", async () => {
    prisma.project.findFirst.mockResolvedValue(null);

    const result = await getProjectByIdService(
      "project-b",
      { companyId: "company-a" }
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe("Project not found");
    expect(prisma.project.findFirst).toHaveBeenCalledWith({
      where: {
        id: "project-b",
        companyId: "company-a",
      },
    });
  });

  test("blocks updating another company's project", async () => {
    prisma.project.findFirst.mockResolvedValue(null);

    const result = await updateProjectService(
      "project-b",
      { name: "Changed name" },
      { companyId: "company-a" }
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe("Project not found");
    expect(prisma.project.update).not.toHaveBeenCalled();
  });

  test("blocks deleting another company's project", async () => {
    prisma.project.findFirst.mockResolvedValue(null);

    const result = await deleteProjectService(
      "project-b",
      { companyId: "company-a" }
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe("Project not found");
    expect(prisma.project.delete).not.toHaveBeenCalled();
  });

  test("assigns new projects to the current company", async () => {
    prisma.project.findFirst.mockResolvedValue(null);
    prisma.project.create.mockResolvedValue({
      id: "project-a",
      name: "Project A",
      companyId: "company-a",
    });

    const result = await createProjectService(
      { name: "Project A" },
      { companyId: "company-a" }
    );

    expect(result.success).toBe(true);
    expect(prisma.project.create).toHaveBeenCalledWith({
      data: {
        name: "Project A",
        companyId: "company-a",
      },
    });
  });
});
