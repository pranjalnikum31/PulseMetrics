const prisma = require("../config/prisma");
const redis = require("../config/redis");
const { producer } = require("../config/kafka");
const { checkUsageLimit } = require("./usage.service");

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
        publicKey: apiKey,
      },
      select: {
        projectId: true,
        isActive: true,
        project: {
          select: {
            companyId: true,
            company: {
              select: {
                plan: true,
              },
            },
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
    const usage = await checkUsageLimit(
      apiKeyRecord.project.companyId,
      apiKeyRecord.project.company.plan,
    );

    if (!usage.allowed) {
      const error = new Error("Monthly event limit reached");
      error.statusCode = 429;
      throw error;
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
const createServerEventService = async (eventData, apiKey) => {
  try {
    if (!apiKey) {
      return { success: false, message: "API key is required" };
    }

    const apiKeyRecord = await prisma.apiKey.findUnique({
      where: { secretKey: apiKey },
      select: {
        projectId: true,
        isActive: true,
        project: {
          select: {
            companyId: true,
            company: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    });

    if (!apiKeyRecord) {
      return { success: false, message: "Invalid secret API key" };
    }

    if (!apiKeyRecord.isActive) {
      return { success: false, message: "API key is inactive" };
    }

    const usage = await checkUsageLimit(
      apiKeyRecord.project.companyId,
      apiKeyRecord.project.company.plan,
    );

    if (!usage.allowed) {
      const error = new Error("Monthly event limit reached");
      error.statusCode = 429;
      throw error;
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
      message: "Event queued successfully",
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createEventService,
  createServerEventService,
};
