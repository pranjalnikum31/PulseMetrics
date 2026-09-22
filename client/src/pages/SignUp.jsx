import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    ownerName: "",
    ownerEmail: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await register(formData);

      if (!response.success) {
        setError(response.message);
        return;
      }

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D18] text-white flex items-center justify-center px-6">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            Pulse<span className="text-[#6366F1]">Metrics</span>
          </h1>

          <p className="text-[#94A3B8] mt-2">
            Create your analytics workspace
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0D1422] border border-white/10 rounded-xl p-8 shadow-xl">

          <div className="mb-7">
            <h2 className="text-xl font-semibold">
              Create account
            </h2>

            <p className="text-sm text-[#94A3B8] mt-1">
              Set up your company and start tracking events.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Company Name */}
            <div>
              <label className="block text-sm text-[#94A3B8] mb-2">
                Company name
              </label>

              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Acme Inc."
                required
                className="w-full bg-[#080D18] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none placeholder:text-[#475569] focus:border-[#6366F1] transition"
              />
            </div>

            {/* Company Email */}
            <div>
              <label className="block text-sm text-[#94A3B8] mb-2">
                Company email
              </label>

              <input
                name="companyEmail"
                type="email"
                value={formData.companyEmail}
                onChange={handleChange}
                placeholder="company@example.com"
                required
                className="w-full bg-[#080D18] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none placeholder:text-[#475569] focus:border-[#6366F1] transition"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-sm text-[#94A3B8] mb-2">
                Your name
              </label>

              <input
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full bg-[#080D18] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none placeholder:text-[#475569] focus:border-[#6366F1] transition"
              />
            </div>

            {/* Owner Email */}
            <div>
              <label className="block text-sm text-[#94A3B8] mb-2">
                Your email
              </label>

              <input
                name="ownerEmail"
                type="email"
                value={formData.ownerEmail}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full bg-[#080D18] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none placeholder:text-[#475569] focus:border-[#6366F1] transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-[#94A3B8] mb-2">
                Password
              </label>

              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-[#080D18] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none placeholder:text-[#475569] focus:border-[#6366F1] transition"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6366F1] hover:bg-[#818CF8] disabled:opacity-50 rounded-lg py-3 text-sm font-medium transition"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          {/* Login */}
          <div className="border-t border-white/10 mt-6 pt-6 text-center">
            <p className="text-sm text-[#94A3B8]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#6366F1] hover:text-[#818CF8] transition"
              >
                Log in
              </Link>
            </p>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#64748B] mt-6">
          PulseMetrics · Product Analytics Platform
        </p>

      </div>

    </div>
  );
}

export default Signup;