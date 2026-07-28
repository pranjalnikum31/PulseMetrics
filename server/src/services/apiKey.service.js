const prisma = require("../config/prisma");
const crypto = require("crypto");

const createApiKeyService = async (data, user) => {
  try {
    const { name, projectId } = data;
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        companyId: user.companyId,
      },
    });
    if (!project) {
      return {
        success: false,
        message: "Project not found",
      };
    }
    const publicKey = "pk_live_" + crypto.randomBytes(24).toString("hex");
    const secretKey = "sk_live_" + crypto.randomBytes(32).toString("hex");

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        publicKey,
        secretKey,
        projectId,//sending both keys for now
      },
    });
    return {
      success: true,
      message: "API key created successfully",
      data: apiKey,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error creating API key",
    };
  }
};

module.exports = {
  createApiKeyService,
};
