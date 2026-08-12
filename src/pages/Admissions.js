import { useState } from "react";
import Hero from "../components/Hero";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { GRADE_OPTIONS, VACATION_PROGRAM, CONTACT_INFO } from "../utils/constants";

const STEPS = [
  { number: "1", title: "Inquire", description: "Submit the form below or contact our admissions office." },
  { number: "2", title: "Apply", description: "Complete the application and submit required documents." },
  { number: "3", title: "Assessment", description: "Attend an entrance assessment and family interview." },
  { number: "4", title: "Enrollment", description: "Receive your offer and complete enrollment." },
];

const REQUIRED_DOCUMENTS = [
  "Completed application form",
  "Birth certificate (certified copy)",
  "Previous school report / transcript",
  "Passport-size photograph",
  "Immunization records",
];



const whatsappUrl = `https://wa.me/263${CONTACT_INFO.whatsapp.replace(/^0/, "").replace(/\D/g, "")}`;

const Admissions = () => {
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    phone: "",
    grade: GRADE_OPTIONS[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // NOTE: No backend yet - this is a placeholder submission.
    // Replace with a real API call via services/api.js once available.
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div>
      <Hero
        title="Admissions"
        subtitle="Begin your child's journey with us. Here's how to apply."
      />

      {/* Steps */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center font-heading text-2xl font-bold text-textPrimary sm:text-3xl">
          Our Admission Process
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary font-heading text-lg font-bold text-white">
                {step.number}
              </div>
              <h3 className="mt-4 font-heading text-lg font-semibold text-textPrimary">
                {step.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-textSecondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* August Vacation School */}
      <section className="bg-primary px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            {VACATION_PROGRAM.title}
          </h2>
          <p className="mt-3 font-body text-gray-200">{VACATION_PROGRAM.subtitle}</p>
          <p className="mt-1 font-body text-secondary font-semibold">{VACATION_PROGRAM.dates}</p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {VACATION_PROGRAM.fees.map((fee) => (
              <div key={fee.label} className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <p className="font-body text-sm text-gray-300">{fee.label}</p>
                <p className="mt-2 font-heading text-2xl font-bold text-secondary">{fee.amount}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 font-body text-sm text-gray-300">
            Subjects offered: {VACATION_PROGRAM.subjects.join(", ")} - {VACATION_PROGRAM.accommodation}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-xl bg-secondary px-6 py-3 font-body text-sm font-semibold text-primaryDark transition-colors hover:bg-white"
          >
            Enquire on WhatsApp: {CONTACT_INFO.whatsapp}
          </a>
        </div>
      </section>

      {/* Requirements + Form */}
      <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Requirements */}
          <div>
            <h2 className="font-heading text-2xl font-bold text-textPrimary">
              Required Documents
            </h2>
            <ul className="mt-6 space-y-3">
              {REQUIRED_DOCUMENTS.map((doc) => (
                <li key={doc} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-secondary" aria-hidden="true" />
                  <span className="font-body text-sm text-textSecondary">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Enquiry form */}
          <div className="rounded-xl border border-border bg-surface p-8 shadow-md">
            <h2 className="font-heading text-xl font-bold text-textPrimary">
              Request Information
            </h2>

            {submitted ? (
              <p className="mt-4 font-body text-sm text-textPrimary">
                Thank you! Your enquiry has been received. Our admissions team will
                be in touch shortly.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label htmlFor="parentName" className="block font-body text-sm font-medium text-textPrimary">
                    Parent / Guardian Name
                  </label>
                  <input
                    id="parentName"
                    name="parentName"
                    type="text"
                    required
                    value={formData.parentName}
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
                  <label htmlFor="phone" className="block font-body text-sm font-medium text-textPrimary">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 font-body text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="grade" className="block font-body text-sm font-medium text-textPrimary">
                    Grade Applying For
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-2.5 font-body text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {GRADE_OPTIONS.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader size="sm" /> : "Submit Enquiry"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admissions;
