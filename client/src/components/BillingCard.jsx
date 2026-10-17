import { useEffect, useState } from "react";
import { getProfile } from "../services/api";

const BillingCard = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const profile = await getProfile();
        console.log("Profile response:", profile);
        const companyPlan =
          profile?.user?.company?.plan ??
          profile?.user?.plan ??
          profile?.company?.plan ??
          profile?.plan;
          
        if (companyPlan) {
          setPlan(companyPlan);
        } else {
          setError("Could not determine your current plan.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load your current plan.",
        );
      } finally {
        setProfileLoading(false);
      }
    };

    fetchPlan();
  }, []);

  const handleUpgrade = async () => {
    setError("");
    setLoading(true);

    try {
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout failed to load. Refresh and try again.",
        );
      }

      const { createBillingSubscription } = await import("../services/api");
      const data = await createBillingSubscription();

      const checkout = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        subscription_id: data.subscriptionId,
        name: "PulseMetrics",
        description: "PRO Monthly Subscription",
        handler: () => {
          setError(
            "Authorization received. Your plan will update after the verified Razorpay webhook.",
          );
          setLoading(false);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        theme: {
          color: "#111827",
        },
      });

      checkout.on("payment.failed", (response) => {
        setError(
          response.error?.description || "Payment failed. Please try again.",
        );
        setLoading(false);
      });

      checkout.open();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to start checkout.",
      );
      setLoading(false);
    }
  };

  const isPro = plan === "PRO";

  return (
    <div className="rounded-xl border border-gray-800 bg-[#111827] p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Your Plan</h2>
          <p className="mt-1 text-sm text-gray-400">Current subscription</p>
        </div>

        <span className="rounded-full bg-gray-800 px-3 py-1 text-sm font-medium text-gray-200">
          {profileLoading ? "Loading..." : plan || "Unknown"}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-2xl font-bold text-white">
          {profileLoading ? "Loading..." : isPro ? "₹999/month" : "Free"}
        </p>
        <p className="mt-1 text-sm text-gray-400">
          {isPro
            ? "You're on the PRO plan."
            : "Upgrade for higher event limits."}
        </p>
      </div>

      {error && (
        <p role="status" className="mt-4 text-sm text-yellow-400">
          {error}
        </p>
      )}

      {!profileLoading && !isPro && plan && (
        <button
          type="button"
          onClick={handleUpgrade}
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-white px-4 py-3 font-medium text-gray-900 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Opening checkout..." : "Upgrade to PRO"}
        </button>
      )}
    </div>
  );
};

export default BillingCard;
