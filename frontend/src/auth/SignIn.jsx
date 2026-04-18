import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Sign-up failed. Please try again.");
      }

      navigate("/login");
    } catch (submitError) {
      if (submitError.message?.includes("arguments") || submitError.message?.includes("User is not defined")) {
        setError("Sign-up failed due to an unexpected problem. Please try again.");
      } else {
        setError(submitError.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative flex-1 w-full flex items-center justify-center px-4 py-10 z-0 overflow-hidden">
      <div className="fixed inset-0 bg-slate-950 -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute top-[50%] -right-[10%] w-[40%] h-[60%] rounded-full bg-cyan-600/10 blur-[100px]" />
        <div className="absolute inset-0 bg-slate-950/40" />
      </div>
      
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-xl shadow-2xl shadow-black/50">
        <h1 className="text-3xl font-bold text-white">Create your account</h1>
        <p className="mt-1 text-sm text-slate-200">Start building optimized trips in seconds.</p>

        {error && (
          <p className="mt-4 rounded-lg border border-red-300/50 bg-red-500/20 px-3 py-2 text-sm text-red-100">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={onChange}
            required
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
            minLength={6}
          />
          <input
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={onChange}
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-3 font-medium text-white disabled:opacity-60 shadow-md shadow-indigo-900/20"
          >
            {isLoading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-200">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
