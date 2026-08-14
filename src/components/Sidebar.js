import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { House, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// `links` shape: [{ label: "Grades", to: "/dashboard/student/grades", icon: SomeLucideIcon }]
const Sidebar = ({ links = [], title = "Dashboard" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const closeDrawer = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeDrawer();
    navigate("/");
  };

  const navLinkClasses = ({ isActive }) =>
    [
      "flex items-center gap-3 rounded-xl border-l-4 px-4 py-2.5 text-sm font-medium font-body transition-colors duration-200",
      isActive
        ? "border-primary bg-primary/5 text-primary"
        : "border-transparent text-textSecondary hover:bg-background hover:text-primary",
    ].join(" ");

  const NavList = ({ onNavigate }) => (
    <ul className="space-y-1">
      {links.map(({ label, to, icon: Icon }) => (
        <li key={to}>
          <NavLink to={to} end onClick={onNavigate} className={navLinkClasses}>
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile top bar with hamburger toggle */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <h2 className="font-heading text-base font-semibold text-textPrimary">{title}</h2>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-controls="sidebar-drawer"
          aria-label="Open dashboard menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-textPrimary hover:bg-background"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer + backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-textPrimary/50 lg:hidden"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}
      <aside
        id="sidebar-drawer"
        className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-surface shadow-lg transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-lg font-semibold text-textPrimary">{title}</h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close dashboard menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-textPrimary hover:bg-background"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav aria-label="Dashboard navigation" className="p-3">
          <NavList onNavigate={closeDrawer} />
        </nav>
        <div className="border-t border-border p-3">
                    <NavLink to="/" onClick={closeDrawer} className="mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium font-body text-textSecondary transition-colors duration-200 hover:bg-background hover:text-primary">
            <House className="h-4 w-4 shrink-0" />
            Back to Website
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium font-body text-textSecondary transition-colors duration-200 hover:bg-background hover:text-primary"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Desktop static sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <div className="px-6 py-5">
          <h2 className="font-heading text-lg font-semibold text-textPrimary">{title}</h2>
        </div>
        <nav aria-label="Dashboard navigation" className="flex-1 px-3">
          <NavList />
        </nav>
        <div className="border-t border-border p-3">
                    <NavLink to="/" onClick={closeDrawer} className="mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium font-body text-textSecondary transition-colors duration-200 hover:bg-background hover:text-primary">
            <House className="h-4 w-4 shrink-0" />
            Back to Website
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium font-body text-textSecondary transition-colors duration-200 hover:bg-background hover:text-primary"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;