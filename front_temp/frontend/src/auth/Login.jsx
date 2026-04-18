import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Page3DBackground from "@/visuals/background/Page3DBackground";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Login failed. Please check your credentials.");
      if (data?.token) localStorage.setItem("authToken", data.token);
      if (data?.user) localStorage.setItem("authUser", JSON.stringify(data.user));
      navigate("/create-trip");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12"
      style={{ background: "var(--navy-950)", fontFamily: "var(--font-body)" }}
    >
      <Page3DBackground particleCount={500} />

      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(30,58,112,0.35) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div
        className="relative z-10 w-full max-w-md rounded-2xl p-8"
        style={{
          background: "rgba(10,22,40,0.8)",
          border: "1px solid rgba(232,184,75,0.18)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,184,75,0.06)",
        }}
      >
        {/* Header */}
        <div className="mb-7">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
            style={{ background: "linear-gradient(135deg, #e8b84b 0%, #c9961f 100%)" }}
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5L10 6H14.5L11 9L12.5 14L8 11.5L3.5 14L5 9L1.5 6H6L8 1.5Z" fill="#050b18" />
            </svg>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 600,
              color: "var(--ivory)",
              lineHeight: 1.1,
            }}
          >
            Welcome back
          </h1>
          <p className="mt-1.5" style={{ color: "rgba(237,231,218,0.5)", fontSize: "0.9rem" }}>
            Log in to continue planning your perfect trip
          </p>
        </div>

        {/* Divider */}
        <div className="divider-gold mb-7" />

        {error && (
          <div
            className="mb-5 rounded-xl px-4 py-3 text-sm"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#fca5a5",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "rgba(245,208,110,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Email address
            </label>
            <input
              className="input-dark w-full rounded-xl px-4 py-3 text-sm"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: "rgba(245,208,110,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Password
            </label>
            <input
              className="input-dark w-full rounded-xl px-4 py-3 text-sm"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-gold w-full rounded-xl px-4 py-3.5 text-sm font-semibold mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Logging in...
              </span>
            ) : "Log in →"}
          </button>
        </form>

        <div className="divider-gold mt-7 mb-5" />

        <p className="text-sm text-center" style={{ color: "rgba(237,231,218,0.4)" }}>
          New to Urban Tourism?{" "}
          <Link to="/sign-in" style={{ color: "var(--gold-300)" }} className="font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
