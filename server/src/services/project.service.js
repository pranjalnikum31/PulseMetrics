const prisma = require("../config/prisma");

const createProjectService = async (data, user) => {
  const { name, description } = data;

  if (!name) {
    return {
      success: false,
      message: "Project name is required",
    };
  }
  const existingProject = await prisma.project.findFirst({
    where: {
      name,
      companyId: user.companyId,
    },
  });
  if (existingProject) {
    return {
      success: false,
      message: "Project already exists",
    };
  }
  const project = await prisma.project.create({
    data: {
      name,
      companyId: user.companyId,
    },
  });
  return {
    success: true,
    message: "Project created successfully",
    project,
  };
};

const getAllProjectsService = async (user) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        companyId: user.companyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return {
      success: true,
      message: "Projects fetched successfully",
      data: projects,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error occurred while fetching projects",
    };
  }
};

const getProjectByIdService = async (id, user) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });
    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }
    return {
      success: true,
      message: "Project fetched successfully",
      data: project,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error occurred while fetching project",
    };
  }
};

const updateProjectService = async (id, data, user) => {
  try {
    const { name } = data;
    const project = await prisma.project.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });
    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }
    const existingProject = await prisma.project.findFirst({
      where: {
        name,
        companyId: user.companyId,
        NOT: {
          id,
        },
      },
    });

    if (existingProject) {
      return {
        success: false,
        message: "Project with this name already exists",
      };
    }
    const updatedProject = await prisma.project.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    return {
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error occurred while updating project",
    };
  }
};

const deleteProjectService = async (id, user) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id,
        companyId: user.companyId,
      },
    });
    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }
    await prisma.project.delete({
      where: {
        id,
      },
    });
    return {
      success: true,
      message: "Project deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error occurred while deleting project",
    };
  }
};

module.exports = {
  createProjectService,
  getAllProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService
};
