import { Link } from "react-router-dom";
import { Phone, MapPin, Calendar, Home, MessageCircle } from "lucide-react";
import { NAV_LINKS, CONTACT_INFO, SCHOOL_NAME, VACATION_PROGRAM } from "../utils/constants";
import logo from "../assets/images/logo.webp";

const QUICK_LINKS = NAV_LINKS.filter((link) =>
  ["About", "Academics", "Admissions", "News", "Events", "Contact"].includes(link.label)
);

const whatsappUrl = `https://wa.me/263${CONTACT_INFO.whatsapp.replace(/^0/, "").replace(/\D/g, "")}`;
const phoneUrl = `tel:${CONTACT_INFO.phone.replace(/\D/g, "")}`;

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
              Cambridge-affiliated education for Form 1 to 6. Nurturing excellence,
              character, and lifelong learning.
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
                <MessageCircle className="h-4 w-4 shrink-0 text-secondary" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-secondary"
                >
                  WhatsApp {CONTACT_INFO.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-secondary" />
                <a href={phoneUrl} className="transition-colors hover:text-secondary">
                  Call {CONTACT_INFO.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* August Vacation School */}
          <div>
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-white">
              {VACATION_PROGRAM.title}
            </h3>
            <ul className="space-y-3 font-body text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span>{VACATION_PROGRAM.dates}</span>
              </li>
              <li>{VACATION_PROGRAM.subtitle}</li>
              <li>
                <span className="text-gray-300">Fees: </span>
                {VACATION_PROGRAM.fees.map((fee) => `${fee.label} ${fee.amount}`).join(" - ")}
              </li>
              <li className="flex items-center gap-2">
                <Home className="h-4 w-4 shrink-0 text-secondary" />
                <span>{VACATION_PROGRAM.accommodation}</span>
              </li>
            </ul>
            <Link
              to="/admissions"
              className="mt-4 inline-block font-body text-sm font-semibold text-secondary transition-colors hover:text-white"
            >
              Register for vacation school ->
            </Link>
          </div>
        </div>

        {/* Vacation promo strip */}
        <div className="mt-10 rounded-xl border border-secondary/20 bg-white/5 px-6 py-4 text-center">
          <p className="font-body text-sm text-gray-300">
            <span className="font-semibold text-secondary">{VACATION_PROGRAM.title}</span>
            {" - "}
            {VACATION_PROGRAM.dates}
            {" - "}
            {VACATION_PROGRAM.subjects.join(", ")}
            {" - "}
            Enroll via WhatsApp{" "}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:text-secondary">
              {CONTACT_INFO.whatsapp}
            </a>
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center font-body text-xs text-gray-500">
          Copyright {year} {SCHOOL_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
