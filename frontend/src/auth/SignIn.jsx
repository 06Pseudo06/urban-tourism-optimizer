import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";

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
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const text = await response.text();
      console.log("RAW RESPONSE:", text);
      const data = JSON.parse(text);
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
    <section className="relative flex-1 w-full flex flex-col items-center justify-center px-4 py-12 z-0">
      <div className="w-full max-w-md mx-auto glass-1 p-6">
        <h1 className="text-3xl font-semibold text-white">Create your account</h1>
        <p className="mt-1 text-sm text-slate-400">Start building optimized trips in seconds.</p>

        {error && (
          <p className="mt-4 rounded-lg border border-red-300/50 bg-red-500/20 px-3 py-2 text-sm text-red-100">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            className="input-dark"
            type="text"
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={onChange}
            required
          />
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
            minLength={6}
          />
          <input
            className="input-dark"
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
            className="w-full primary-btn mt-4 disabled:opacity-60 text-center"
          >
            {isLoading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
