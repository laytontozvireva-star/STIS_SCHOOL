import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Edit3,
  Save,
  X,
  Camera,
  LayoutDashboard,
  Lock,
  Bell,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

/* ── Helper: get initials ── */
const getInitials = (name) =>
  name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

/* ── Role badge colour ── */
const roleBadge = {
  student: "bg-blue-100 text-blue-700",
  teacher: "bg-green-100 text-green-700",
  parent: "bg-amber-100 text-amber-700",
  admin: "bg-purple-100 text-purple-700",
};

/* ── Section wrapper ── */
const Section = ({ title, icon: Icon, children }) => (
  <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
    <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-textPrimary">
      <Icon className="h-5 w-5 text-primary" />
      {title}
    </h2>
    {children}
  </div>
);

/* ── Editable field ── */
const Field = ({ label, value, editing, name, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold uppercase tracking-wide text-textSecondary">
      {label}
    </label>
    {editing ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-textPrimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
      />
    ) : (
      <p className="text-sm font-medium text-textPrimary">{value || "—"}</p>
    )}
  </div>
);

/* ══════════════════════════════════════════════════════════════════ */
const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  /* Local editable copy of profile data */
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+263 000 000 000",
    address: "Harare, Zimbabwe",
    bio: "A valued member of the school community.",
  });

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "profile", label: "Profile Info" },
    { id: "security", label: "Security" },
    { id: "notifications", label: "Notifications" },
  ];

  return (
    <main className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* ── Page header ── */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-heading text-textPrimary">
              My Profile
            </h1>
            <p className="text-sm text-textSecondary mt-1">
              Manage your personal information and account settings
            </p>
          </div>
          <button
            onClick={() => navigate(`/dashboard/${user.role}`)}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-semibold text-textPrimary hover:bg-background transition"
          >
            <LayoutDashboard className="h-4 w-4 text-primary" />
            Dashboard
          </button>
        </div>

        {/* ── Saved toast ── */}
        {saved && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
            <CheckCircle className="h-5 w-5" />
            Profile saved successfully!
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">

          {/* ── LEFT CARD: Avatar + summary ── */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm text-center">
              {/* Avatar */}
              <div className="relative inline-block">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#0D1F45] text-3xl font-bold text-white shadow-md mx-auto">
                  {getInitials(form.name)}
                </div>
                <button
                  title="Change avatar"
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow hover:bg-primary/90 transition"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Name + role */}
              <h2 className="mt-4 text-lg font-bold font-heading text-textPrimary">
                {form.name}
              </h2>
              <span
                className={`mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${
                  roleBadge[user.role] || "bg-gray-100 text-gray-600"
                }`}
              >
                {user.role}
              </span>
              <p className="mt-2 text-xs text-textSecondary">{form.email}</p>

              {/* Quick stats */}
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5">
                <div className="rounded-xl bg-background p-3">
                  <p className="text-xl font-bold text-primary">2026</p>
                  <p className="text-xs text-textSecondary">Year Joined</p>
                </div>
                <div className="rounded-xl bg-background p-3">
                  <p className="text-xl font-bold text-primary capitalize">
                    {user.role}
                  </p>
                  <p className="text-xs text-textSecondary">Account Type</p>
                </div>
              </div>
            </div>

            {/* Navigation tabs (sidebar style on desktop) */}
            <div className="hidden lg:flex flex-col gap-1 rounded-2xl border border-border bg-surface p-3 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "text-textSecondary hover:bg-background hover:text-textPrimary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Content panel ── */}
          <div className="space-y-5">

            {/* Mobile tabs */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "border border-border bg-surface text-textSecondary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── TAB: Profile Info ── */}
            {activeTab === "profile" && (
              <>
                <Section title="Personal Information" icon={User}>
                  {/* Edit / Save buttons */}
                  <div className="mb-4 flex justify-end gap-2">
                    {editing ? (
                      <>
                        <button
                          onClick={() => setEditing(false)}
                          className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-sm font-semibold text-textSecondary hover:bg-background transition"
                        >
                          <X className="h-4 w-4" /> Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary/90 transition"
                        >
                          <Save className="h-4 w-4" /> Save Changes
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-sm font-semibold text-textPrimary hover:bg-background transition"
                      >
                        <Edit3 className="h-4 w-4 text-primary" /> Edit
                      </button>
                    )}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Full Name"
                      name="name"
                      value={form.name}
                      editing={editing}
                      onChange={handleChange}
                    />
                    <Field
                      label="Email Address"
                      name="email"
                      value={form.email}
                      editing={editing}
                      onChange={handleChange}
                      type="email"
                    />
                    <Field
                      label="Phone Number"
                      name="phone"
                      value={form.phone}
                      editing={editing}
                      onChange={handleChange}
                      type="tel"
                    />
                    <Field
                      label="Location"
                      name="address"
                      value={form.address}
                      editing={editing}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mt-5">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-textSecondary">
                      Bio
                    </label>
                    {editing ? (
                      <textarea
                        name="bio"
                        rows={3}
                        value={form.bio}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-textPrimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition resize-none"
                      />
                    ) : (
                      <p className="text-sm text-textPrimary">{form.bio}</p>
                    )}
                  </div>
                </Section>

                {/* Contact info summary */}
                <Section title="Contact Details" icon={Mail}>
                  <div className="space-y-3">
                    {[
                      { icon: Mail, label: form.email || "No email" },
                      { icon: Phone, label: form.phone || "No phone" },
                      { icon: MapPin, label: form.address || "No address" },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </span>
                        <span className="text-sm text-textPrimary">{label}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              </>
            )}

            {/* ── TAB: Security ── */}
            {activeTab === "security" && (
              <Section title="Security Settings" icon={Shield}>
                <div className="space-y-5">
                  {/* Change password */}
                  <div className="rounded-xl border border-border p-4">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-textPrimary">
                      <Lock className="h-4 w-4 text-primary" />
                      Change Password
                    </h3>
                    <div className="space-y-3">
                      {["Current Password", "New Password", "Confirm New Password"].map(
                        (label) => (
                          <div key={label} className="flex flex-col gap-1">
                            <label className="text-xs font-semibold uppercase tracking-wide text-textSecondary">
                              {label}
                            </label>
                            <input
                              type="password"
                              placeholder="••••••••"
                              className="rounded-xl border border-border bg-background px-3 py-2 text-sm text-textPrimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                            />
                          </div>
                        )
                      )}
                      <button className="mt-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Active session */}
                  <div className="rounded-xl border border-border p-4">
                    <h3 className="mb-3 text-sm font-bold text-textPrimary">
                      Active Session
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-semibold text-textPrimary">This device</p>
                        <p className="text-xs text-textSecondary">Last active: just now</p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </Section>
            )}

            {/* ── TAB: Notifications ── */}
            {activeTab === "notifications" && (
              <Section title="Notification Preferences" icon={Bell}>
                <div className="space-y-4">
                  {[
                    { label: "Email notifications", desc: "Receive updates via email", on: true },
                    { label: "Grade updates", desc: "Notify when grades are posted", on: true },
                    { label: "Event reminders", desc: "Upcoming school events", on: false },
                    { label: "Announcements", desc: "General school announcements", on: true },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-xl border border-border p-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-textPrimary">
                          {item.label}
                        </p>
                        <p className="text-xs text-textSecondary">{item.desc}</p>
                      </div>
                      {/* Toggle */}
                      <button
                        className={`relative h-6 w-11 rounded-full transition-colors duration-300 focus:outline-none ${
                          item.on ? "bg-primary" : "bg-border"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
                            item.on ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
