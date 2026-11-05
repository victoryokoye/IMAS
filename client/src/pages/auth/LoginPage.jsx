import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../../hooks/auth/useLogin";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // assumed: default landing page

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await login({ email: identifier, password }); // assumed: backend field name
    if (ok) navigate(from, { replace: true });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm p-6">
      <div className="flex flex-col items-center text-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-900 mt-2">
          Sign In to IMAS
        </h1>
        <p className="text-sm text-slate-500">
          Welcome back, please enter your details.
        </p>
      </div>

      <label className="block text-xs font-semibold text-slate-800 mb-1">
        Email
      </label>
      <input
        type="text"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        placeholder="admin@imas.com"
        autoComplete="email"
        required
        className="w-full rounded-lg bg-blue-50 px-3 py-3 text-sm mb-4 outline-none focus:ring-2 focus:ring-orange-500"
      />

      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-semibold text-slate-800">Password</label>
        <a
          href="/forgot-password"
          className="text-xs font-semibold text-orange-700"
        >
          Forgot password?
        </a>
      </div>
      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg bg-blue-50 px-3 py-3 pr-14 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 mb-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 mt-4 disabled:opacity-60"
      >
        {isLoading ? "Signing in..." : "Sign In →"}
      </button>
    </form>
  );
}
