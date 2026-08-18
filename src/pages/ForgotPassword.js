import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Loader from "../components/Loader";

const ForgotPassword = () => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setMessage(""); setError("");
    if (!email.trim()) return setError("Enter your email address.");
    setSending(true);
    try {
      await requestPasswordReset(email.trim());
      setMessage("If an account exists for this email address, a password-reset link has been sent.");
    } catch (requestError) {
      setError(requestError.message || "Could not send the reset email.");
    } finally {
      setSending(false);
    }
  };

  return <div className="flex min-h-[80vh] items-center justify-center bg-background px-4 py-12"><div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-lg"><h1 className="font-heading text-2xl font-bold text-textPrimary">Reset your password</h1><p className="mt-2 text-sm text-textSecondary">Enter your account email and we will send a reset link.</p>{message && <p role="status" className="mt-5 rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}{error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}<form onSubmit={submit} className="mt-6 space-y-4"><label className="block text-sm font-medium text-textPrimary">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-textPrimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label><Button type="submit" variant="primary" className="w-full" disabled={sending}>{sending ? <Loader size="sm" /> : "Send reset link"}</Button></form><p className="mt-5 text-center text-sm text-textSecondary"><Link to="/login" className="font-medium text-primary hover:underline">Back to sign in</Link></p></div></div>;
};

export default ForgotPassword;