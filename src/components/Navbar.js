import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAvatarUrl } from "../services/profileService";
import { MAIN_NAV_LINKS } from "../utils/constants";
import logo from "../assets/images/logo.webp";

/* ─── Desktop link styles ─────────────────────────────────────────── */
const desktopLinkClasses = ({ isActive }) =>
  [
    "group relative px-1 py-2 text-sm font-semibold font-body transition-colors duration-300",
    isActive ? "text-secondary" : "text-white/80 hover:text-secondary",
  ].join(" ");


/* ─── Mobile link styles ──────────────────────────────────────────── */
const mobileLinkClasses = ({ isActive }) =>
  [
    "block rounded-xl px-4 py-3 text-base font-semibold font-body transition-all duration-300",
    isActive
      ? "bg-primary/5 text-primary border-l-4 border-secondary"
      : "text-textSecondary hover:bg-background hover:text-primary border-l-4 border-transparent",
  ].join(" ");

const DROPDOWNS = {
  About: [
    { label: "About Us", to: "/about" },
    { label: "Gallery", to: "/gallery" },
    { label: "News", to: "/news" },
    { label: "Events", to: "/events" },
  ],
  Academics: [
    { label: "Academics Overview", to: "/academics" },
    { label: "Departments", to: "/departments" },
    { label: "Staff", to: "/staff" },
  ],
};

/* ─── Navbar ──────────────────────────────────────────────────────── */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [mobileDropdowns, setMobileDropdowns] = useState({ about: false, academics: false });
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const closeMenu = () => setIsOpen(false);

  const toggleMobileDropdown = (menu) => {
    setMobileDropdowns((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    setProfileOpen(false);
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
  // Get initials for avatar
  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";

  const Avatar = ({ className, textClassName }) =>
    avatarUrl ? (
      <img src={avatarUrl} alt="" className={`${className} object-cover`} />
    ) : (
      <span className={`${className} flex items-center justify-center bg-primary font-bold text-white ${textClassName}`}>
        {getInitials(user?.name)}
      </span>
    );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-primaryDark shadow-lg shadow-primaryDark/25">
      <div className="hidden border-b border-white/10 bg-primaryDark/90 sm:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100 lg:px-8">
          <p>Learn. Lead. Thrive.</p>
          <div className="flex items-center gap-5">
            <Link to="/admissions" className="transition-colors hover:text-secondary">Admissions</Link>
            <Link to="/contact" className="transition-colors hover:text-secondary">Contact Us</Link>
          </div>
        </div>
      </div>
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:h-20 lg:px-8"
      >
        {/* ── Left: Logo ── */}
        <Link
          to="/"
          className="mr-6 flex shrink-0 items-center gap-3"
          onClick={closeMenu}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white p-1 shadow-md ring-1 ring-white/20 lg:h-12 lg:w-12">
            <img
              src={logo}
              alt="S.T.I.S school logo"
              className="h-full w-full object-contain"
            />
          </span>
          <span className="hidden min-w-0 md:block">
            <span className="block font-heading text-lg font-bold leading-none tracking-wide text-white">S.T.I.S</span>
            <span className="mt-1 block max-w-[135px] truncate text-[9px] font-semibold uppercase tracking-[0.12em] text-blue-100 lg:max-w-none">Sir Tshobs International School</span>
          </span>
        </Link>

        {/* ── Center: Nav links (flex-1 so they fill & center) ── */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <ul className="flex items-center gap-1 xl:gap-2">
            {MAIN_NAV_LINKS.map((link) => {
              const dropdownItems = DROPDOWNS[link.label];
              if (dropdownItems) {
                const isCurrentActive = dropdownItems.some((item) => location.pathname === item.to);
                return (
                  <li key={link.label} className="relative group py-2">
                    <button
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={isCurrentActive}
                      className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold font-body transition-colors duration-300 ${
                        isCurrentActive ? "text-secondary" : "text-white/80 hover:text-secondary"
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />

                    </button>
                    {/* Dropdown Menu */}
                    <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-48 rounded-2xl border border-white/10 bg-primaryDark/95 p-1.5 shadow-xl opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                      <ul>
                        {dropdownItems.map((sub) => (
                          <li key={sub.to}>
                            <NavLink
                              to={sub.to}
                              className={({ isActive }) =>
                                `block rounded-xl px-4 py-2.5 text-xs font-semibold font-body transition-colors duration-150 ${
                                  isActive
                                    ? "bg-secondary text-primaryDark"
                                    : "text-white/85 hover:bg-white/10 hover:text-white"
                                }`
                              }
                            >
                              {sub.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              }

              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={desktopLinkClasses}
                  >
                    {link.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Right: Auth area ── */}
        <div className="ml-auto flex items-center gap-3">
          {isAuthenticated ? (
            /* ── User profile dropdown ── */
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold font-body text-textPrimary transition-all duration-200 hover:border-primary/40 hover:bg-background"
              >
                {/* Avatar circle */}
                <Avatar className="h-7 w-7 rounded-full" textClassName="text-xs" />
                <span className="max-w-[120px] truncate">{user.name}</span>
                <ChevronDown
                  className={`h-4 w-4 text-textSecondary transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-border bg-surface shadow-xl animate-fade-in">
                  {/* User info header */}
                  <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                    <Avatar className="h-9 w-9 rounded-full" textClassName="text-sm" />
                    <div className="overflow-hidden">
                      <p className="truncate text-sm font-semibold text-textPrimary">
                        {user.name}
                      </p>
                      <p className="truncate text-xs capitalize text-textSecondary">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <ul className="p-1.5">
                    <li>
                      <Link
                        to={`/dashboard/${user.role}`}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-body text-textPrimary transition-colors duration-150 hover:bg-background hover:text-primary"
                      >
                        <LayoutDashboard className="h-4 w-4 text-primary" />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-body text-textPrimary transition-colors duration-150 hover:bg-background hover:text-primary"
                      >
                        <User className="h-4 w-4 text-primary" />
                        My Profile
                      </Link>
                    </li>
                    <li className="mt-1 border-t border-border pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-body text-red-500 transition-colors duration-150 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/admissions"
                className="hidden rounded-xl border border-secondary bg-secondary px-4 py-2 text-sm font-semibold font-body text-primaryDark shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-secondary/90 hover:shadow-lg xl:inline-block"
              >
                Apply Now
              </Link>
              <Link
                to="/login"
                className="hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold font-body text-white shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg lg:inline-block"
              >
                Login
              </Link>
            </>
          )}

          {/* ── Mobile hamburger ── */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close main menu" : "Open main menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors duration-200 hover:bg-white/10 lg:hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <div
        id="mobile-menu"
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          isOpen ? "max-h-[calc(100vh-4rem)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-1 border-t border-border bg-surface px-4 py-4">
          {MAIN_NAV_LINKS.map((link) => {
            const dropdownItems = DROPDOWNS[link.label];
            if (dropdownItems) {
              const isOpenDropdown = mobileDropdowns[link.label.toLowerCase()];
              return (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => toggleMobileDropdown(link.label.toLowerCase())}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-semibold font-body text-textSecondary hover:bg-background hover:text-primary"
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isOpenDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpenDropdown && (
                    <ul className="mt-1 ml-4 border-l border-border pl-2 space-y-1 animate-fade-in">
                      {dropdownItems.map((sub) => (
                        <li key={sub.to}>
                          <NavLink
                            to={sub.to}
                            onClick={closeMenu}
                            className={mobileLinkClasses}
                          >
                            {sub.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  onClick={closeMenu}
                  className={mobileLinkClasses}
                >
                  {link.label}
                </NavLink>
              </li>
            );
          })}

          {/* Mobile auth */}
          <li className="pt-3 border-t border-border space-y-2">
            {isAuthenticated ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-2">
                  <Avatar className="h-9 w-9 rounded-full" textClassName="text-sm" />
                  <div>
                    <p className="text-sm font-semibold text-textPrimary">{user.name}</p>
                    <p className="text-xs capitalize text-textSecondary">{user.role}</p>
                  </div>
                </div>
                <Link
                  to={`/dashboard/${user.role}`}
                  onClick={closeMenu}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-semibold font-body text-white hover:bg-primary/90"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Go to Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-base font-semibold font-body text-red-500 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/admissions"
                  onClick={closeMenu}
                  className="block rounded-xl bg-secondary px-4 py-3 text-center text-base font-semibold font-body text-primaryDark hover:bg-secondary/90"
                >
                  Apply Now
                </Link>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block rounded-xl bg-primary px-4 py-3 text-center text-base font-semibold font-body text-white hover:bg-primary/90"
                >
                  Login
                </Link>
              </>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;