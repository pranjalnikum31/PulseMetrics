const prisma = require("../config/prisma");
const { checkUsageLimit } = require("../services/usage.service");

const getUsage = async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: {
        id: req.user.companyId,
      },
      select: {
        plan: true,
      },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const usage = await checkUsageLimit(
      req.user.companyId,
      company.plan
    );

    const percentage = Math.min(
      (usage.usage / usage.limit) * 100,
      100
    );

    res.json({
      success: true,
      data: {
        plan: company.plan,
        usage: usage.usage,
        limit: usage.limit,
        remaining: usage.remaining,
        percentage: Number(percentage.toFixed(1)),
      },
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getUsage,
};