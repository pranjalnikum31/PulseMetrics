const prisma = require("../config/prisma");
const redis = require("../config/redis");

const createEventService = async (eventData, apiKey) => {
  try {
    if (!apiKey) {
      return {
        success: false,
        message: "API key is required",
      };
    }

    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: {
        secretKey: apiKey,
      },
      select: {
        projectId: true,
        isActive: true,
        project: {
          select: {
            companyId: true,
          },
        },
      },
    });

    if (!apiKeyRecord) {
      return {
        success: false,
        message: "Invalid API key",
      };
    }

    if (!apiKeyRecord.isActive) {
      return {
        success: false,
        message: "API key is inactive",
      };
    }

    const event = await prisma.event.create({
      data: {
        eventName: eventData.eventName,
        properties: eventData.properties,
        projectId: apiKeyRecord.projectId,
      },
    });

    const cacheKey = `overview:company:${apiKeyRecord.project.companyId}`;

    await redis.del(cacheKey);

    return {
      success: true,
      message: "Event recorded successfully",
      data: event,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createEventService,
};
