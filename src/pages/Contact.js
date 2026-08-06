import { useState } from "react";
import Hero from "../components/Hero";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { MessageCircle, Phone, MapPin } from "lucide-react";
import { CONTACT_INFO } from "../utils/constants";

const CONTACT_DETAILS = [
  { icon: MapPin, label: "Address", value: CONTACT_INFO.address },
  { icon: Phone, label: "Phone", value: CONTACT_INFO.phone },
  { icon: MessageCircle, label: "WhatsApp", value: CONTACT_INFO.whatsapp },
];

const whatsappUrl = `https://wa.me/263${CONTACT_INFO.whatsapp.replace(/^0/, "").replace(/\D/g, "")}`;
const phoneUrl = `tel:${CONTACT_INFO.phone.replace(/\D/g, "")}`;

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // NOTE: No backend yet — placeholder submission, same pattern as Admissions form.
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div>
      <Hero
        title="Contact Us"
        subtitle="We'd love to hear from you — reach out with any questions."
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Contact details */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-textPrimary">
              Get in Touch
            </h2>
            <p className="mt-3 font-body text-sm text-textSecondary">
              Have a question about admissions, academics, or anything else?
              Our team is here to help.
            </p>

            <div className="mt-8 space-y-6">
              {CONTACT_DETAILS.map(({ icon: Icon, label, value }) => {
                const href = label === "WhatsApp" ? whatsappUrl : label === "Phone" ? phoneUrl : null;

                return (
                <div key={label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium text-textPrimary">{label}</p>
                    {href ? (
                      <a href={href} className="font-body text-sm text-primary hover:underline">{value}</a>
                    ) : (
                      <p className="font-body text-sm text-textSecondary">{value}</p>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-xl border border-border bg-surface p-8 shadow-md">
            <h2 className="font-heading text-xl font-bold text-textPrimary">
              Send a Message
            </h2>

            {submitted ? (
              <p className="mt-4 font-body text-sm text-textPrimary">
                Thank you for reaching out! We'll get back to you as soon as possible.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="name" className="block font-body text-sm font-medium text-textPrimary">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 font-body text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-body text-sm font-medium text-textPrimary">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 font-body text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-body text-sm font-medium text-textPrimary">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 font-body text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader size="sm" /> : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-16">
          <div className="flex h-64 w-full items-center justify-center rounded-xl border border-border bg-surface font-body text-sm text-textSecondary sm:h-80">
            Map will be displayed here once location details are configured.
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;