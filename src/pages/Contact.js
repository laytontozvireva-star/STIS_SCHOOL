import { useState } from "react";
import Hero from "../components/Hero";
import schoolGatheringImage from "../assets/images/gallery/stis-16.webp";
import Button from "../components/Button";
import Loader from "../components/Loader";
import {
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  Navigation,
  Mail,
  Compass,
} from "lucide-react";
import { CONTACT_INFO } from "../utils/constants";
import { submitContactMessage } from "../services/contactMessagesService";

/* ─── derived URLs ──────────────────────────────────────────────────────── */
const whatsappUrl = `https://wa.me/263${CONTACT_INFO.whatsapp
  .replace(/^0/, "")
  .replace(/\D/g, "")}`;
const phoneUrl = `tel:${CONTACT_INFO.phone.replace(/\D/g, "")}`;

/* ─── quick-contact cards ───────────────────────────────────────────────── */
const QUICK_CONTACTS = [
  {
    icon: MapPin,
    label: "Address",
    value: CONTACT_INFO.address,
    sub: CONTACT_INFO.region,
    href: null,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: Phone,
    label: "Phone",
    value: CONTACT_INFO.phone,
    href: phoneUrl,
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: CONTACT_INFO.whatsapp,
    href: whatsappUrl,
    color: "text-green-600 bg-green-50",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: CONTACT_INFO.officeHours,
    href: null,
    color: "text-amber-600 bg-amber-50",
  },
];

/* ─── directions steps ──────────────────────────────────────────────────── */
const DIRECTION_STEPS = [
  "Head east out of Harare on the Harare–Mutare (A3) highway.",
  "Continue through Ruwa and Marondera towards Juru Growth Point.",
  "Look for the Juru ZINWA offices on your left — the school is directly opposite.",
  "Turn into 1063 Juru Locations. The school gate is clearly signposted.",
];

/* ════════════════════════════════════════════════════════════════════════════
   Component
═══════════════════════════════════════════════════════════════════════════ */
const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await submitContactMessage(formData);
      setSubmitted(true);
    } catch (submissionError) {
      setError("We could not send your message. Please try again or contact the school directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Hero
        title="Contact Us"
        subtitle="We'd love to hear from you — reach out with any questions."
        backgroundImage={schoolGatheringImage}
      />

      {/* ── Quick-contact + form ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

          {/* Left: contact cards */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-textPrimary">
              Get in Touch
            </h2>
            <p className="mt-3 font-body text-sm text-textSecondary">
              Have a question about admissions, academics, or anything else?
              Our team is here to help.
            </p>

            <div className="mt-8 space-y-4">
              {QUICK_CONTACTS.map(({ icon: Icon, label, value, sub, href, color }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-body text-xs font-semibold uppercase tracking-wide text-textSecondary">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="font-body text-sm font-medium text-primary hover:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="font-body text-sm font-medium text-textPrimary">
                        {value}
                      </p>
                    )}
                    {sub && (
                      <p className="mt-0.5 font-body text-xs text-textSecondary">
                        {sub}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: message form */}
          <div className="rounded-xl border border-border bg-surface p-8 shadow-md">
            <h2 className="font-heading text-xl font-bold text-textPrimary">
              Send a Message
            </h2>

            {submitted ? (
              <div className="mt-6 rounded-xl bg-primary/10 p-6 text-center">
                <Mail className="mx-auto mb-3 h-8 w-8 text-primary" />
                <p className="font-body text-sm font-medium text-textPrimary">
                  Thank you for reaching out!
                </p>
                <p className="mt-1 font-body text-xs text-textSecondary">
                  We'll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {error && <p role="alert" className="rounded-lg bg-red-50 p-3 font-body text-sm text-red-700">{error}</p>}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-body text-sm font-medium text-textPrimary"
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 font-body text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-body text-sm font-medium text-textPrimary"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 font-body text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block font-body text-sm font-medium text-textPrimary"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 font-body text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader size="sm" /> : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Find Us / Map section ───────────────────────────────────────── */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-textPrimary">
                Find Us
              </h2>
              <p className="font-body text-sm text-textSecondary">
                {CONTACT_INFO.address} &mdash; {CONTACT_INFO.region}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

            {/* Map embed — takes 2/3 width on large screens */}
            <div className="overflow-hidden rounded-2xl border border-border shadow-md lg:col-span-2">
              <iframe
                id="school-location-map"
                title="Sir Tshobs International School — Location Map"
                src={CONTACT_INFO.mapEmbedUrl}
                width="100%"
                height="420"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Directions sidebar — 1/3 width */}
            <div className="flex flex-col gap-6">

              {/* Landmark callout */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex items-center gap-2 text-amber-700">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <p className="font-body text-xs font-semibold uppercase tracking-wide">
                    Key Landmark
                  </p>
                </div>
                <p className="mt-2 font-body text-sm text-amber-900">
                  {CONTACT_INFO.landmark}
                </p>
              </div>

              {/* Step-by-step directions */}
              <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 text-textPrimary">
                  <Navigation className="h-4 w-4 text-primary" />
                  <p className="font-body text-sm font-semibold">
                    Driving Directions
                  </p>
                </div>
                <ol className="mt-4 space-y-3">
                  {DIRECTION_STEPS.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-body text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <p className="font-body text-xs leading-relaxed text-textSecondary">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Get Directions CTA */}
              <a
                id="get-directions-btn"
                href={CONTACT_INFO.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-body text-sm font-semibold text-white shadow transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <Navigation className="h-4 w-4" />
                Get Directions on Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;