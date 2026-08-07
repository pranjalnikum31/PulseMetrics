const prisma = require("../config/prisma");

const getOverviewService = async (user) => {
  try {
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
    return {
      success: true,
      data: {
        totalProjects,
        totalEvents,
        activeApiKeys,
      },
    };
  } catch (error) {
    throw error;
  }
};
const getTopEventsService = async (user) => {
  try {
    const topEvents = await prisma.event.groupBy({
      by: ["eventName"],
      where: {
        project: {
          companyId: user.companyId,
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

    const formattedEvents = topEvents.map((event) => ({
      eventName: event.eventName,
      count: event._count.eventName,
    }));
    return {
      success: true,
      data: formattedEvents,
    };
  } catch (error) {
    throw error;
  }
};
const getRecentEventsService = async (user) => {
  try {
    const recentEvents = await prisma.event.findMany({
      where: {
        project: {
          companyId: user.companyId,
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
    const formattedEvents = recentEvents.map((event) => ({
      eventName: event.eventName,
      project: event.project.name,
      timestamp: event.timestamp,
    }));
    return {
      success: true,
      data: formattedEvents,
    };
  } catch (error) {
    throw error;
  }
};
const getEventsByDayService = async (user, days) => {
  try {
    days = Number(days) || 7;

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
        },
      },
      select: {
        timestamp: true,
      },
      orderBy: {
        timestamp: "asc",
      },
    });
    const eventsByDay = events.reduce((acc, event) => {
      const date = event.timestamp.toISOString().split("T")[0];

      acc[date] = (acc[date] || 0) + 1;

      return acc;
    }, {});

    const formattedData = Object.keys(eventsByDay).map((date) => ({
      date,
      count: eventsByDay[date],
    }));

    return {
      success: true,
      data: formattedData,
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
};
