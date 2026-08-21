import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, MapPin, Calendar, Home, MessageCircle, ArrowUp } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { MAIN_NAV_LINKS, FOOTER_NAV_LINKS, CONTACT_INFO, SCHOOL_NAME, VACATION_PROGRAM } from "../utils/constants";
import logo from "../assets/images/logo.webp";

const QUICK_LINKS = [...MAIN_NAV_LINKS, ...FOOTER_NAV_LINKS];

const whatsappUrl = `https://wa.me/263${CONTACT_INFO.whatsapp.replace(/^0/, "").replace(/\D/g, "")}`;
const phoneUrl = `tel:${CONTACT_INFO.phone.replace(/\D/g, "")}`;

const Footer = () => {
  const year = new Date().getFullYear();
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollBtn(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-primaryDark text-gray-300 pt-16">
      {/* Wave SVG divider at the top */}
      <div className="absolute top-0 left-0 right-0 -translate-y-[99%] overflow-hidden leading-[0] w-full text-primaryDark pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,90.47,26.85,188.75,52.2,262.27,64.1,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>

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
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:bg-secondary hover:text-white transition-all duration-300" aria-label="Facebook">
                <FaFacebook className="h-4.5 w-4.5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:bg-secondary hover:text-white transition-all duration-300" aria-label="Instagram">
                <FaInstagram className="h-4.5 w-4.5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-gray-400 hover:bg-secondary hover:text-white transition-all duration-300" aria-label="Twitter">
                <FaTwitter className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer quick links">
            <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wide text-white">
              Explore
            </h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
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

      {/* Floating action buttons (WhatsApp + Back to Top) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        {/* WhatsApp — always visible */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-white shadow-lg shadow-green-500/30 hover:bg-green-600 transition-all duration-300 hover:-translate-y-1 active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="h-6 w-6" />
        </a>

        {/* Back to Top — only after scrolling */}
        {showScrollBtn && (
          <button
            onClick={scrollToTop}
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-white shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all duration-300 hover:-translate-y-1 active:scale-95 cursor-pointer"
            aria-label="Back to Top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;
