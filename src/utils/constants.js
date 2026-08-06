// Centralized values used across multiple components/pages.
// Editing here keeps Footer, Contact, and Navbar consistent —
// but note: this file is not yet wired into those components.
// See the note at the end of this task's summary.

export const SCHOOL_NAME = "School Name";

export const CONTACT_INFO = {
  address: "123 Education Lane, Harare, Zimbabwe",
  phone: "+263 000 000 000",
  email: "info@schoolname.edu",
  officeHours: "Mon - Fri, 8:00 AM - 4:00 PM",
};

export const SOCIAL_LINKS = {
  facebook: "#",
  twitter: "#",
  instagram: "#",
};

export const NAV_LINKS = [
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

export const GRADE_OPTIONS = [
  "Form 1 (O'Level)",
  "Form 2 (O'Level)",
  "Form 3 (O'Level)",
  "Form 4 (O'Level)",
  "Form 5 (A'Level)",
  "Form 6 (A'Level)",
];

export const USER_ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
  PARENT: "parent",
  ADMIN: "admin",
};