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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Login failed. Please check your credentials.");
      }

      if (data?.token) {
        localStorage.setItem("authToken", data.token);
      }
      if (data?.user) {
        localStorage.setItem("authUser", JSON.stringify(data.user));
      }
      window.dispatchEvent(new Event("authChange"));
      navigate("/create-trip");
    } catch (submitError) {
      if (submitError.message?.includes("arguments")) {
        setError("Invalid email or password.");
      } else {
        setError(submitError.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
      <Page3DBackground particleCount={650} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-7 backdrop-blur-xl shadow-2xl shadow-cyan-900/25">
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-200">Login to continue planning your trip.</p>

        {error && (
          <p className="mt-4 rounded-lg border border-red-300/50 bg-red-500/20 px-3 py-2 text-sm text-red-100">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-4 py-3 text-white placeholder:text-slate-300/70"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
          />
          <input
            className="w-full rounded-xl border border-white/20 bg-slate-950/45 px-4 py-3 text-white placeholder:text-slate-300/70"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="hero-gradient-btn w-full rounded-xl px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-200">
          New here?{" "}
          <Link to="/sign-in" className="font-semibold text-cyan-300 hover:text-cyan-200">
            Create account
          </Link>
        </p>
      </div>
    </section>
  );
}
