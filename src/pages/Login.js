import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Loader from "../components/Loader";

const Login = () => {
  const { login, register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/dashboard/${user.role}`, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    if (mode === "register") {
      if (!formData.name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login({ email: formData.email, password: formData.password });
        // Navigation handled by the useEffect above once user is set
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        setSuccess(
          "Account created! Please check your email to confirm your account, then log in."
        );
        setMode("login");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ROLES = [
    { value: "student", label: "Student" },
    { value: "teacher", label: "Teacher" },
    { value: "parent", label: "Parent" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-lg">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-textPrimary">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-1 text-sm text-textSecondary">
            {mode === "login"
              ? "Sign in to access your dashboard."
              : "Register to join the school portal."}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="mb-6 flex rounded-xl border border-border bg-background p-1">
          {["login", "register"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(""); setSuccess(""); }}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition-all duration-200 ${
                mode === m
                  ? "bg-primary text-white shadow-sm"
                  : "text-textSecondary hover:text-textPrimary"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Success message */}
        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name (register only) */}
          {mode === "register" && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-textPrimary">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                placeholder="John Doe"
                className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-textPrimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-textPrimary">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-textPrimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-textPrimary">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder="••••••••"
              className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-textPrimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>

          {/* Confirm password (register only) */}
          {mode === "register" && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-textPrimary">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-textPrimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
          )}

          {/* Role (register only) */}
          {mode === "register" && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-textPrimary">
                Register as
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-textPrimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader size="sm" />
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Forgot password */}
        {mode === "login" && (
          <p className="mt-4 text-center text-sm text-textSecondary">
            <Link to="#" className="text-primary hover:underline font-medium">
              Forgot your password?
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;