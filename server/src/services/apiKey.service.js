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
        projectId, //sending both keys for now
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

const getAllApiKeysService = async (user) => {
  try {
    const apiKeys = await prisma.apiKey.findMany({
      where: {
        project: {
          companyId: user.companyId,
        },
      },
      select: {
        id: true,
        name: true,
        publicKey: true,
        isActive: true,
        createdAt: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return {
      success: true,
      message: "API keys fetched successfully",
      data: apiKeys,
    };
  } catch (error) {}
};

const updateApiKeyService = async (id, data, user) => {
  try {
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id,
        project: {
          companyId: user.companyId,
        },
      },
    });
    if (!apiKey) {
      return {
        success: false,
        message: "API key not found",
      };
    }
    const { name, isActive } = data;
    const updatedApiKey = await prisma.apiKey.update({
      where: {
        id,
      },
      data: {
        name,
        isActive,
      },
    });
    return {
      success: true,
      message: "API key updated successfully",
      data: updatedApiKey,
    };
  } catch (error) {}
};

module.exports = {
  createApiKeyService,
  getAllApiKeysService,
};
