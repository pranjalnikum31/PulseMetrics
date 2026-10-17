const prisma = require("../config/prisma");
const redis = require("../config/redis");

const getOverviewService = async (user) => {
  try {
    const cacheKey = `overview:company:${user.companyId}`;

    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log("Overview cache hit");
      return {
        success: true,
        data: JSON.parse(cachedData),
      };
    }

    console.log("Overview cache miss");

    const totalProjects = await prisma.project.count({
      where: {
        companyId: user.companyId,
      },
    });

    const totalEvents = await prisma.event.count({
      where: {
        project: {
          companyId: user.companyId,
        },
      },
    });

    const activeApiKeys = await prisma.apiKey.count({
      where: {
        isActive: true,
        project: {
          companyId: user.companyId,
        },
      },
    });

    const data = {
      totalProjects,
      totalEvents,
      activeApiKeys,
    };

    await redis.set(cacheKey, JSON.stringify(data), {
      EX: 60,
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    throw error;
  }
};

const getTopEventsService = async (user, days = 7) => {
  try {
    days = [7, 30, 90].includes(Number(days)) ? Number(days) : 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    const topEvents = await prisma.event.groupBy({
      by: ["eventName"],
      where: {
        project: {
          companyId: user.companyId,
        },
        timestamp: {
          gte: startDate,
          lte: new Date(),
        },
      },
      _count: {
        eventName: true,
      },
      orderBy: {
        _count: {
          eventName: "desc",
        },
      },
      take: 5,
    });

    return {
      success: true,
      data: topEvents.map((event) => ({
        eventName: event.eventName,
        count: event._count.eventName,
      })),
    };
  } catch (error) {
    throw error;
  }
};

const getRecentEventsService = async (user, days = 7) => {
  try {
    days = [7, 30, 90].includes(Number(days)) ? Number(days) : 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    const recentEvents = await prisma.event.findMany({
      where: {
        project: {
          companyId: user.companyId,
        },
        timestamp: {
          gte: startDate,
          lte: new Date(),
        },
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 10,
    });

    return {
      success: true,
      data: recentEvents.map((event) => ({
        id: event.id,
        eventName: event.eventName,
        project: event.project.name,
        timestamp: event.timestamp,
      })),
    };
  } catch (error) {
    throw error;
  }
};
  

const getEventsByDayService = async (user, days) => {
  try {
    days = [7, 30, 90].includes(Number(days)) ? Number(days) : 7;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    const events = await prisma.event.findMany({
      where: {
        project: {
          companyId: user.companyId,
        },
        timestamp: {
          gte: startDate,
          lte: new Date(),
        },
      },
      select: {
        timestamp: true,
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    const eventsByDay = {};

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dateKey = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      eventsByDay[dateKey] = 0;
    }

    for (const event of events) {
      const timestamp = new Date(event.timestamp);
      const dateKey = [
        timestamp.getFullYear(),
        String(timestamp.getMonth() + 1).padStart(2, "0"),
        String(timestamp.getDate()).padStart(2, "0"),
      ].join("-");

      if (Object.prototype.hasOwnProperty.call(eventsByDay, dateKey)) {
        eventsByDay[dateKey]++;
      }
    }

    const formattedData = Object.entries(eventsByDay).map(
      ([date, count]) => ({ date, count })
    );

    return {
      success: true,
      data: formattedData,
    };
  } catch (error) {
    throw error;
  }
};



const getProjectAnalyticsService = async (projectId, user, days = 7) => {
  try {
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

    const cacheKey = `analytics:company:${user.companyId}:project:${projectId}:${days}`;
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log("Project analytics cache hit");
      return {
        success: true,
        data: JSON.parse(cachedData),
      };
    }

    console.log("Project analytics cache miss");

    // Keep the existing analytics queries and data formatting below.

    

    const totalEventsResult = await prisma.$queryRaw`
      SELECT COUNT(*)::int AS count
      FROM "Event"
      WHERE "projectId" = ${projectId}
        AND "timestamp" >= CURRENT_DATE - (${days} - 1) * INTERVAL '1 day'
    `;

    const totalEvents = totalEventsResult[0].count;

    const topEvents = await prisma.event.groupBy({
      by: ["eventName"],
      where: {
        projectId,
        project: {
          companyId: user.companyId,
        },
        timestamp: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
      _count: {
        eventName: true,
      },
      orderBy: {
        _count: {
          eventName: "desc",
        },
      },
      take: 5,
    });

    const recentEvents = await prisma.event.findMany({
      where: {
        projectId,
        project: {
          companyId: user.companyId,
        },
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 10,
      select: {
        id: true,
        eventName: true,
        properties: true,
        timestamp: true,
      },
    });

    const eventsByDay = await prisma.$queryRaw`
      SELECT
        dates.date,
        COALESCE(edc.event_count, 0)::int AS count
      FROM generate_series(
        CURRENT_DATE - (${days} - 1) * INTERVAL '1 day',
        CURRENT_DATE,
        INTERVAL '1 day'
      ) AS dates(date)
      LEFT JOIN event_daily_counts edc
        ON edc.day = dates.date
        AND edc."projectId" = ${projectId}
      ORDER BY dates.date ASC
    `;
    const data = {
      project,
      totalEvents,
      topEvents: topEvents.map((event) => ({
        eventName: event.eventName,
        count: event._count.eventName,
      })),
      recentEvents,
      eventsByDay,
    };

    await redis.set(cacheKey, JSON.stringify(data), {
      EX: 60,
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getOverviewService,
  getTopEventsService,
  getRecentEventsService,
  getEventsByDayService,
  getProjectAnalyticsService,
};
