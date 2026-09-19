const prisma = require("../config/prisma");
const redis = require("../config/redis");
const { producer } = require("../config/kafka");

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

    await producer.send({
      topic: "pulsemetrics-events",
      messages: [
        {
          key: apiKeyRecord.projectId,
          value: JSON.stringify({
            eventName: eventData.eventName,
            properties: eventData.properties,
            projectId: apiKeyRecord.projectId,
          }),
        },
      ],
    });

    return {
      success: true,
      message: "Event recorded successfully",
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createEventService,
};
