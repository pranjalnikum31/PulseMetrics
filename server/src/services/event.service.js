const prisma = require("../config/prisma");

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
