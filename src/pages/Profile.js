import { useEffect, useRef, useState } from "react";
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
  CalendarDays,
  GraduationCap,
  Megaphone,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAvatarUrl, updateProfile, uploadAvatar } from "../services/profileService";

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

const DEFAULT_NOTIFICATION_PREFERENCES = {
  email: true,
  grades: true,
  events: false,
  announcements: true,
};

const NOTIFICATION_OPTIONS = [
  { key: "email", label: "Email notifications", desc: "Receive important updates in your inbox", icon: Mail, tone: "bg-blue-50 text-blue-600" },
  { key: "grades", label: "Grade updates", desc: "Know when new results are posted", icon: GraduationCap, tone: "bg-violet-50 text-violet-600" },
  { key: "events", label: "Event reminders", desc: "Get reminders for upcoming school events", icon: CalendarDays, tone: "bg-amber-50 text-amber-600" },
  { key: "announcements", label: "Announcements", desc: "Receive important school notices", icon: Megaphone, tone: "bg-emerald-50 text-emerald-600" },
];
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
  const { user, isAuthenticated, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [notificationPreferences, setNotificationPreferences] = useState(DEFAULT_NOTIFICATION_PREFERENCES);
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState("");

  /* Local editable copy of profile data */
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+263 000 000 000",
    address: "Harare, Zimbabwe",
    bio: "A valued member of the school community.",
  });


  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  useEffect(() => {
    let active = true;
    if (!user?.avatar_path) {
      setAvatarUrl(null);
      return undefined;
    }
    getAvatarUrl(user.avatar_path)
      .then((url) => { if (active) setAvatarUrl(url); })
      .catch(() => { if (active) setAvatarUrl(null); });
    return () => { active = false; };
  }, [user?.avatar_path]);

  useEffect(() => {
    setNotificationPreferences({
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      ...(user?.notification_preferences || {}),
    });
  }, [user?.notification_preferences]);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAvatarError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Please choose an image smaller than 5 MB.");
      return;
    }

    setUploadingAvatar(true);
    setAvatarError("");
    try {
      const url = await uploadAvatar(user.id, file);
      setAvatarUrl(url);
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setAvatarError(error.message || "Could not upload your profile photo.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleNotificationToggle = async (key) => {
    const nextPreferences = { ...notificationPreferences, [key]: !notificationPreferences[key] };
    setNotificationPreferences(nextPreferences);
    setNotificationError("");
    setSavingNotifications(true);
    try {
      await updateProfile(user.id, { notification_preferences: nextPreferences });
      await refreshProfile();
    } catch (error) {
      setNotificationPreferences(notificationPreferences);
      setNotificationError(error.message || "Could not save notification preferences.");
    } finally {
      setSavingNotifications(false);
    }
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
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="h-24 w-24 rounded-full object-cover shadow-md" />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#0D1F45] text-3xl font-bold text-white shadow-md">
                    {getInitials(form.name)}
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatarChange} className="sr-only" />
                <button
                  type="button"
                  title="Change profile photo"
                  aria-label="Change profile photo"
                  disabled={uploadingAvatar}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
                >
                  {uploadingAvatar ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Camera className="h-4 w-4" />}
                </button>
              </div>
              {avatarError && <p className="mt-3 text-xs font-medium text-red-600" role="alert">{avatarError}</p>}

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
                <div className="-mt-1 space-y-5">
                  <div className="rounded-xl border border-primary/10 bg-primary/5 px-4 py-3">
                    <p className="text-sm font-semibold text-textPrimary">Choose what you want to hear about</p>
                    <p className="mt-1 text-xs leading-5 text-textSecondary">Your choices are saved automatically and apply to your account.</p>
                  </div>
                  {notificationError && <p className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600" role="alert">{notificationError}</p>}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {NOTIFICATION_OPTIONS.map((item) => {
                      const Icon = item.icon;
                      const enabled = notificationPreferences[item.key];
                      return (
                        <button key={item.key} type="button" disabled={savingNotifications} aria-pressed={enabled} onClick={() => handleNotificationToggle(item.key)} className={`group flex min-h-28 items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-wait disabled:opacity-60 ${enabled ? "border-primary/30 bg-primary/[0.03] shadow-sm" : "border-border bg-background hover:border-primary/20 hover:bg-surface"}`}>
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.tone}`}><Icon className="h-5 w-5" /></span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2"><span className="text-sm font-bold text-textPrimary">{item.label}</span><span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-slate-200"}`}><span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} /></span></span>
                            <span className="mt-1.5 block text-xs leading-5 text-textSecondary">{item.desc}</span>
                            <span className={`mt-2 block text-xs font-semibold ${enabled ? "text-primary" : "text-textSecondary"}`}>{enabled ? "Enabled" : "Disabled"}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
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
