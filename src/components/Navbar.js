import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { NAV_LINKS, SCHOOL_NAME } from "../utils/constants";
import logo from "../assets/images/logo.jpg";

const desktopLinkClasses = ({ isActive }) =>
  [
    "group relative px-1 py-2 text-sm font-semibold font-body transition-colors duration-300",
    isActive
      ? "text-primary"
      : "text-textSecondary hover:text-primary",
  ].join(" ");

const DesktopLinkUnderline = ({ isActive }) => (
  <span
    className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300 ${
      isActive ? "w-full" : "w-0 group-hover:w-full"
    }`}
  />
);

const mobileLinkClasses = ({ isActive }) =>
  [
    "block rounded-xl px-4 py-3 text-base font-semibold font-body transition-all duration-300",
    isActive
      ? "bg-primary/5 text-primary border-l-4 border-secondary"
      : "text-textSecondary hover:bg-background hover:text-primary border-l-4 border-transparent",
  ].join(" ");

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <nav
        aria-label="Primary"
        className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8"
      >
        {/* Left: Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={closeMenu}>
          <img src={logo} alt="School logo" className="h-10 w-10 object-contain lg:h-12 lg:w-12" />
          <span className="hidden font-heading text-lg font-semibold text-textPrimary sm:block lg:text-xl">
            {SCHOOL_NAME}
          </span>
        </Link>

        {/* Center: Desktop navigation, centered */}
        <div className="flex-1 flex items-center justify-center">
          <ul className="hidden lg:flex items-center gap-5 xl:gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.to === '/' } className={desktopLinkClasses}>
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

        {/* Right: Auth area + mobile toggle */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="hidden items-center gap-4 border-l border-border pl-5 lg:flex">
              <Link
                to={`/dashboard/${user.role}`}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold font-body text-white transition-colors duration-200 hover:bg-primary/90"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold font-body text-textPrimary transition-colors duration-200 hover:bg-background"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold font-body text-white transition-colors duration-200 hover:bg-primary/90 lg:inline-block"
            >
              Login
            </Link>
          )}

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

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`overflow-hidden transition-all duration-300 ease-in-out lg:hidden ${
          isOpen ? "max-h-[calc(100vh-4rem)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-1 border-t border-border bg-surface px-4 py-4">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.to === "/"} onClick={closeMenu} className={mobileLinkClasses}>
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className="pt-2 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={`/dashboard/${user.role}`}
                  onClick={closeMenu}
                  className="block rounded-xl bg-primary px-4 py-3 text-center text-base font-semibold font-body text-white transition-colors duration-200 hover:bg-primary/90"
                >
                  Go to Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-xl border border-border px-4 py-3 text-center text-base font-semibold font-body text-textPrimary transition-colors duration-200 hover:bg-background"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="block rounded-xl bg-primary px-4 py-3 text-center text-base font-semibold font-body text-white transition-colors duration-200 hover:bg-primary/90"
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