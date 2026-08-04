import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/images/logo.jpg";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Academics", to: "/academics" },
  { label: "Departments", to: "/departments" },
  { label: "Admissions", to: "/admissions" },
  { label: "Gallery", to: "/gallery" },
  { label: "News", to: "/news" },
  { label: "Events", to: "/events" },
  { label: "Staff", to: "/staff" },
  { label: "Contact", to: "/contact" },
];

const desktopLinkClasses = ({ isActive }) =>
  [
    "px-1 py-2 text-sm font-medium font-body transition-colors duration-200",
    isActive
      ? "text-primary border-b-2 border-primary"
      : "text-textSecondary hover:text-primary",
  ].join(" ");

const mobileLinkClasses = ({ isActive }) =>
  [
    "block rounded-xl px-4 py-3 text-base font-medium font-body transition-colors duration-200",
    isActive
      ? "bg-primary/5 text-primary"
      : "text-textSecondary hover:bg-background hover:text-primary",
  ].join(" ");

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8"
      >
        {/* Left: Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2" onClick={closeMenu}>
          <img src={logo} alt="School logo" className="h-10 w-10 object-contain lg:h-12 lg:w-12" />
          <span className="hidden font-heading text-lg font-semibold text-textPrimary sm:block lg:text-xl">
            School Name
          </span>
        </Link>

        {/* Center: Desktop nav */}
        <ul className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.to === "/"} className={desktopLinkClasses}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right: Login button + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold font-body text-white transition-colors duration-200 hover:bg-primary/90 lg:inline-block"
          >
            Login
          </Link>

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
          <li className="pt-2">
            <Link
              to="/login"
              onClick={closeMenu}
              className="block rounded-xl bg-primary px-4 py-3 text-center text-base font-semibold font-body text-white transition-colors duration-200 hover:bg-primary/90"
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;