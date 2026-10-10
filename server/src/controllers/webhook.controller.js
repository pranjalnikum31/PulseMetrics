
const crypto = require("crypto");
const prisma = require("../config/prisma");

const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];

    if (!signature || !Buffer.isBuffer(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook request",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest("hex");

    const received = Buffer.from(signature, "hex");
    const expected = Buffer.from(expectedSignature, "hex");

    if (
      received.length !== expected.length ||
      !crypto.timingSafeEqual(received, expected)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const event = JSON.parse(req.body.toString());
    const subscriptionId =
      event.payload?.subscription?.entity?.id;

    console.log("Razorpay webhook:", event.event);
    console.log("Subscription ID:", subscriptionId);

    if (
      event.event === "subscription.activated" &&
      subscriptionId
    ) {
      const result = await prisma.company.updateMany({
        where: {
          razorpaySubscriptionId: subscriptionId,
        },
        data: {
          plan: "PRO",
        },
      });

      console.log("Companies upgraded:", result.count);
    }

    if (
      [
        "subscription.cancelled",
        "subscription.halted",
        "subscription.completed",
      ].includes(event.event) &&
      subscriptionId
    ) {
      const result = await prisma.company.updateMany({
        where: {
          razorpaySubscriptionId: subscriptionId,
        },
        data: {
          plan: "FREE",
          razorpaySubscriptionId: null,
        },
      });

      console.log("Companies downgraded:", result.count);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};

module.exports = {
  handleRazorpayWebhook,
};
