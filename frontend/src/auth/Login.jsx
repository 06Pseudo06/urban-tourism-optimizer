import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <section className="relative flex-1 w-full flex flex-col items-center justify-center px-4 py-12 z-0">
      <div className="w-full max-w-md mx-auto glass-1 p-6">
        <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-400">Login to continue planning your trip.</p>

        {error && (
          <p className="mt-4 rounded-lg border border-red-300/50 bg-red-500/20 px-3 py-2 text-sm text-red-100">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className="input-dark"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
          />
          <input
            className="input-dark"
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
            className="w-full primary-btn mt-4 disabled:opacity-60 text-center"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          New here?{" "}
          <Link to="/sign-in" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </section>
  );
}
