const razorpay = require("../config/razorpay");
const prisma = require("../config/prisma");

const createSubscription = async (companyId) => {
  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });

  if (!company) {
    const error = new Error("Company not found");
    error.statusCode = 404;
    throw error;
  }

  if (company.plan === "PRO") {
    const error = new Error("Company is already on PRO plan");
    error.statusCode = 400;
    throw error;
  }

  const subscription = await razorpay.subscriptions.create({
    plan_id: process.env.RAZORPAY_PRO_PLAN_ID,
    total_count: 12,
    customer_notify: 1,
  });

  await prisma.company.update({
    where: {
      id: companyId,
    },
    data: {
      razorpaySubscriptionId: subscription.id,
    },
  });

  return subscription;
};

module.exports = {
  createSubscription,
};