// Centralized values used across multiple components/pages.
// Editing here keeps all public contact displays consistent.

export const SCHOOL_NAME = "Sir Tshobs International School";

export const CONTACT_INFO = {
  // Contact details supplied on the school flyer.
  address: "1063 Juru Locations, Opp. Juru Zinwa",
  phone: "0717 155 557",
  whatsapp: "0717 155 557",
};

export const VACATION_PROGRAM = {
  title: "August Vacation School",
  subtitle: "Form 1 to 6 - Commercials, Arts and Sciences",
  dates: "12 August to 1 September 2026",
  subjects: ["Commercials", "Arts", "Sciences"],
  fees: [
    { label: "Admin fee", amount: "$5.00" },
    { label: "O' Level", amount: "$10/subject" },
    { label: "A' Level", amount: "$20/subject" },
  ],
  accommodation: "Accommodation available",
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
