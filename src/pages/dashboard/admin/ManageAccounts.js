import { useState } from "react";
import { ShieldPlus, UserPlus } from "lucide-react";
import { createPrivilegedAccount } from "../../../services/accountProvisioningService";

const EMPTY_FORM = { name: "", email: "", role: "teacher", subject: "", department: "" };

const ManageAccounts = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const setField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setMessage("");
    try {
      const result = await createPrivilegedAccount({
        ...form,
        redirectTo: `${window.location.origin}/reset-password`
      });
      setForm(EMPTY_FORM);
      setMessage(result.message);
    }
    catch (error) { setMessage(error.message || "Could not create this account."); }
    finally { setSaving(false); }
  };

  return <div className="mx-auto max-w-3xl">
    <div className="mb-8"><h1 className="font-heading text-2xl font-bold text-textPrimary">Create Account</h1><p className="mt-2 font-body text-sm text-textSecondary">Teachers, administrators, and parents receive an email invitation and set their own password.</p></div>
    <form onSubmit={submit} className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3"><span className="rounded-xl bg-primary/10 p-3 text-primary"><ShieldPlus className="h-6 w-6" /></span><div><h2 className="font-heading text-lg font-semibold text-textPrimary">Account details</h2><p className="font-body text-sm text-textSecondary">An invitation link will be emailed so the account owner can create their own password.</p></div></div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2"><Field label="Full name" name="name" value={form.name} onChange={setField} required /><Field label="Email" name="email" type="email" value={form.email} onChange={setField} required /><label className="block"><span className="font-body text-sm font-medium text-textPrimary">Role</span><select name="role" value={form.role} onChange={setField} className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 font-body text-sm outline-none focus:ring-2 focus:ring-primary"><option value="teacher">Teacher</option><option value="parent">Parent</option><option value="admin">Administrator</option></select></label>{form.role === "teacher" && <><Field label="Subject (optional)" name="subject" value={form.subject} onChange={setField} /><Field label="Department (optional)" name="department" value={form.department} onChange={setField} /></>}</div>
      <button disabled={saving} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-body text-sm font-semibold text-white hover:bg-primaryDark disabled:opacity-60"><UserPlus className="h-4 w-4" />{saving ? "Creating..." : "Send invitation"}</button>{message && <p className="mt-4 font-body text-sm text-textSecondary" role="status">{message}</p>}
    </form>
  </div>;
};
const Field = ({ label, ...props }) => <label className="block"><span className="font-body text-sm font-medium text-textPrimary">{label}</span><input {...props} className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 font-body text-sm outline-none focus:ring-2 focus:ring-primary" /></label>;
export default ManageAccounts;