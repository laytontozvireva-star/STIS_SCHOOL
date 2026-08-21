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

const whatsappUrl = `https://wa.me/263${CONTACT_INFO.whatsapp
  .replace(/^0/, "")
  .replace(/\D/g, "")}`;
const phoneUrl = `tel:${CONTACT_INFO.phone.replace(/\D/g, "")}`;

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

const DIRECTION_STEPS = [
  "Head east out of Harare on the Harare–Mutare (A3) highway.",
  "Continue through Ruwa and Marondera towards Juru Growth Point.",
  "Look for the Juru ZINWA offices on your left — the school is directly opposite.",
  "Turn into 1063 Juru Locations. The school gate is clearly signposted.",
];

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

      {/* Quick-contact + form */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left: contact cards */}
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-textPrimary">
              Get in Touch
            </h2>
            <p className="mt-4 font-body text-base text-textSecondary leading-relaxed">
              Have a question about admissions, academics, or anything else?
              Our team is here to help.
            </p>

            <div className="mt-10 space-y-4">
              {QUICK_CONTACTS.map(({ icon: Icon, label, value, sub, href, color }) => {
                const content = (
                  <>
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${color}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-body text-xs font-bold uppercase tracking-wider text-textSecondary">
                        {label}
                      </p>
                      <p className="font-body text-sm font-bold text-textPrimary mt-1 transition-colors duration-200 group-hover:text-primary">
                        {value}
                      </p>
                      {sub && (
                        <p className="mt-0.5 font-body text-xs text-textSecondary">
                          {sub}
                        </p>
                      )}
                    </div>
                  </>
                );

                if (href) {
                  return (
                    <a
                      key={label}
                      href={href}
                      className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-l-4 border-l-transparent hover:border-l-primary"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <div
                    key={label}
                    className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-sm border-l-4 border-l-transparent"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: message form */}
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-lg relative overflow-hidden">
            <h2 className="font-heading text-2xl font-bold text-textPrimary">
              Send a Message
            </h2>

            {submitted ? (
              <div className="mt-8 rounded-2xl bg-primary/10 p-8 text-center animate-fade-in">
                <Mail className="mx-auto mb-4 h-12 w-12 text-primary" />
                <p className="font-body text-sm font-bold text-textPrimary">
                  Thank you for reaching out!
                </p>
                <p className="mt-2 font-body text-xs text-textSecondary">
                  We'll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                {error && <p role="alert" className="rounded-lg bg-red-50 p-4 font-body text-sm text-red-700">{error}</p>}
                
                <div className="relative">
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder=" "
                    value={formData.name}
                    onChange={handleChange}
                    className="peer w-full border-b-2 border-border bg-transparent py-2.5 font-body text-sm text-textPrimary transition-all focus:border-primary focus:outline-none"
                  />
                  <label
                    htmlFor="contact-name"
                    className="absolute left-0 top-2.5 font-body text-sm text-textSecondary transition-all duration-300 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs cursor-text"
                  >
                    Full Name
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    className="peer w-full border-b-2 border-border bg-transparent py-2.5 font-body text-sm text-textPrimary transition-all focus:border-primary focus:outline-none"
                  />
                  <label
                    htmlFor="contact-email"
                    className="absolute left-0 top-2.5 font-body text-sm text-textSecondary transition-all duration-300 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs cursor-text"
                  >
                    Email Address
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    placeholder=" "
                    value={formData.message}
                    onChange={handleChange}
                    className="peer w-full border-b-2 border-border bg-transparent py-2.5 font-body text-sm text-textPrimary transition-all focus:border-primary focus:outline-none resize-none"
                  />
                  <label
                    htmlFor="contact-message"
                    className="absolute left-0 top-2.5 font-body text-sm text-textSecondary transition-all duration-300 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:-top-4 peer-focus:text-xs peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-xs cursor-text"
                  >
                    Message
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader size="sm" /> : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Find Us / Map section */}
      <section className="relative w-full h-[550px] border-t border-border bg-background">
        {/* Full width Map */}
        <iframe
          id="school-location-map"
          title="Sir Tshobs International School — Location Map"
          src={CONTACT_INFO.mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full"
        />

        {/* Overlapping Glassmorphism Info Card */}
        <div className="absolute inset-x-4 bottom-4 md:inset-y-auto md:bottom-auto md:top-10 md:left-10 md:max-w-md bg-white/90 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl relative md:absolute z-10 space-y-6 max-h-[90%] overflow-y-auto">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Compass className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-textPrimary">
                Find Us
              </h2>
              <p className="font-body text-xs text-textSecondary leading-relaxed">
                {CONTACT_INFO.address} &middot; {CONTACT_INFO.region}
              </p>
            </div>
          </div>

          {/* Landmark callout */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
            <div className="flex items-center gap-2 text-amber-700">
              <MapPin className="h-4 w-4 shrink-0" />
              <p className="font-body text-xs font-bold uppercase tracking-wider">
                Key Landmark
              </p>
            </div>
            <p className="mt-1.5 font-body text-xs text-amber-900 leading-relaxed">
              {CONTACT_INFO.landmark}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            <h4 className="font-heading text-xs font-bold text-textPrimary uppercase tracking-wider flex items-center gap-1.5">
              <Navigation className="h-3.5 w-3.5 text-primary" /> Driving Directions
            </h4>
            <ol className="mt-3 space-y-2.5">
              {DIRECTION_STEPS.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 font-body text-[10px] font-bold text-primary">
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
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold font-body text-xs text-white shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all"
          >
            <Navigation className="h-4 w-4" />
            Get Directions on Google Maps
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;