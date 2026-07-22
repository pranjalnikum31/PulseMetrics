const prisma = require("../config/prisma");

const createProject = async (data, user) => {
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

module.exports = {
  createProject,
};
