import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { NAV_LINKS, CONTACT_INFO, SOCIAL_LINKS, SCHOOL_NAME } from "../utils/constants";
import logo from "../assets/images/logo.jpg";

const QUICK_LINKS = NAV_LINKS.filter((link) =>
  ["About", "Academics", "Admissions", "News", "Events", "Contact"].includes(link.label)
);

const SOCIAL_ICONS = [
  { label: "Facebook", href: SOCIAL_LINKS.facebook, initial: "f" },
  { label: "Twitter", href: SOCIAL_LINKS.twitter, initial: "t" },
  { label: "Instagram", href: SOCIAL_LINKS.instagram, initial: "in" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primaryDark text-gray-300 border-t border-primary/20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* School info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="School logo" className="h-10 w-10 object-contain" />
              <span className="font-heading text-lg font-semibold text-white">
                {SCHOOL_NAME}
              </span>
            </Link>
            <p className="font-body text-sm leading-relaxed text-gray-400">
              Committed to academic excellence, character, and community —
              preparing students for a lifetime of learning.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer quick links">
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-body text-sm text-gray-400 transition-colors duration-200 hover:text-secondary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact info */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-white">
              Contact
            </h3>
            <ul className="space-y-3 font-body text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-secondary" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-secondary" />
                <span>{CONTACT_INFO.email}</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-white">
              Follow Us
            </h3>
            <div className="flex gap-3">
              {SOCIAL_ICONS.map(({ label, href, initial }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 font-body text-xs font-semibold text-white transition-colors duration-200 hover:bg-secondary hover:text-textPrimary"
                >
                  {initial}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center font-body text-xs text-gray-500">
          © {year} {SCHOOL_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;