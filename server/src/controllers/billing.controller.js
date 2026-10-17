const { createSubscription } = require("../services/billing.service");

const createSubscriptionController = async (req, res) => {
  try {
    const subscription = await createSubscription(req.user.companyId);

    console.log("Razorpay subscription details:", {
      id: subscription.id,
      plan_id: subscription.plan_id,
      plan: subscription.plan,
      quantity: subscription.quantity,
      status: subscription.status,
    });

    res.status(201).json({
      success: true,
      data: {
        subscriptionId: subscription.id,
        planId: subscription.plan_id,
        status: subscription.status,
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createSubscriptionController,
};
