import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Loader from "../components/Loader";

const ResetPassword = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault(); setError("");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setSaving(true);
    try {
      await updatePassword(password);
      navigate("/login", { replace: true });
    } catch (updateError) {
      setError(updateError.message || "This reset link is invalid or has expired.");
    } finally {
      setSaving(false);
    }
  };

  return <div className="flex min-h-[80vh] items-center justify-center bg-background px-4 py-12"><div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-lg"><h1 className="font-heading text-2xl font-bold text-textPrimary">Choose a new password</h1><p className="mt-2 text-sm text-textSecondary">Enter a new password for your account.</p>{error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}<form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-medium text-textPrimary">New password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-textPrimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label><label className="block text-sm font-medium text-textPrimary">Confirm new password<input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-textPrimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label><Button type="submit" variant="primary" className="w-full" disabled={saving}>{saving ? <Loader size="sm" /> : "Update password"}</Button></form><p className="mt-5 text-center text-sm text-textSecondary"><Link to="/login" className="font-medium text-primary hover:underline">Back to sign in</Link></p></div></div>;
};

export default ResetPassword;