const prisma = require("../config/prisma");

const PLAN_LIMITS = {
  FREE: 10000,
  PRO: 100000,
  BUSINESS: 1000000,
};

const getCurrentMonthUsage = async (companyId) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const usage = await prisma.event.count({
    where: {
      project: {
        companyId,
      },
      timestamp: {
        gte: startOfMonth,
      },
    },
  });

  return usage;
};
const checkUsageLimit = async (companyId, plan) => {
  const usage = await getCurrentMonthUsage(companyId);
  const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;

  return {
    allowed: usage < limit,
    usage,
    limit,
    remaining: Math.max(limit - usage, 0),
  };
};

module.exports = {
  PLAN_LIMITS,
  getCurrentMonthUsage,
  checkUsageLimit,
};
