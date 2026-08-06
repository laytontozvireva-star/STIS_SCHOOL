import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { NAV_LINKS, SCHOOL_NAME } from "../utils/constants";
import logo from "../assets/images/logo.jpg";

/* ─── Desktop link styles ─────────────────────────────────────────── */
const desktopLinkClasses = ({ isActive }) =>
  [
    "group relative px-1 py-2 text-sm font-semibold font-body transition-colors duration-300",
    isActive ? "text-primary" : "text-textSecondary hover:text-primary",
  ].join(" ");

const DesktopLinkUnderline = ({ isActive }) => (
  <span
    className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300 ${
      isActive ? "w-full" : "w-0 group-hover:w-full"
    }`}
  />
);

/* ─── Mobile link styles ──────────────────────────────────────────── */
const mobileLinkClasses = ({ isActive }) =>
  [
    "block rounded-xl px-4 py-3 text-base font-semibold font-body transition-all duration-300",
    isActive
      ? "bg-primary/5 text-primary border-l-4 border-secondary"
      : "text-textSecondary hover:bg-background hover:text-primary border-l-4 border-transparent",
  ].join(" ");

/* ─── Navbar ──────────────────────────────────────────────────────── */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const closeMenu = () => setIsOpen(false);

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

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:h-20 lg:px-8"
      >
        {/* ── Left: Logo ── */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 mr-6"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="School logo"
            className="h-10 w-10 object-contain lg:h-12 lg:w-12"
          />
          <span className="hidden font-heading text-lg font-bold text-textPrimary sm:block lg:text-xl">
            {SCHOOL_NAME}
          </span>
        </Link>

        {/* ── Center: Nav links (flex-1 so they fill & center) ── */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <ul className="flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={desktopLinkClasses}
                >
                  {({ isActive }) => (
                    <>
                      {link.label}
                      <DesktopLinkUnderline isActive={isActive} />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
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
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {getInitials(user.name)}
                </span>
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
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {getInitials(user.name)}
                    </span>
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
            <Link
              to="/login"
              className="hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold font-body text-white shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg lg:inline-block"
            >
              Login
            </Link>
          )}

          {/* ── Mobile hamburger ── */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close main menu" : "Open main menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-textPrimary transition-colors duration-200 hover:bg-background lg:hidden"
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
          {NAV_LINKS.map((link) => (
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
          ))}

          {/* Mobile auth */}
          <li className="pt-3 border-t border-border space-y-2">
            {isAuthenticated ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {getInitials(user.name)}
                  </span>
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
              <Link
                to="/login"
                onClick={closeMenu}
                className="block rounded-xl bg-primary px-4 py-3 text-center text-base font-semibold font-body text-white hover:bg-primary/90"
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;