import { useState } from "react";
import { Check, CheckCircle2, FileText, Send, Sparkles } from "lucide-react";
import Hero from "../components/Hero";
import campusImage from "../assets/images/gallery/stis-12.webp";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { GRADE_OPTIONS, VACATION_PROGRAM, CONTACT_INFO } from "../utils/constants";
import { submitAdmission } from "../services/admissionsService";

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
      await submitAdmission({
        fullName: formData.parentName,
        email: formData.email,
        phone: formData.phone,
        gradeApplying: formData.grade,
      });
      setSubmitted(true);
    } catch (submissionError) {
      setError("We could not submit your enquiry. Please try again or contact the school directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Hero
        title="Admissions"
        subtitle="Begin your child's journey with us. Here's how to apply."
        backgroundImage={campusImage}
      />

      {/* Steps Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl font-extrabold text-textPrimary sm:text-4xl">
            Our Admission Process
          </h2>
          <div className="mt-4 h-1 w-20 bg-secondary mx-auto rounded-full" />
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-start justify-between gap-8 md:gap-6 relative">
          {/* Connecting line for desktop */}
          <div className="absolute top-6 left-8 right-8 hidden h-0.5 bg-border md:block -z-10" />

          {STEPS.map((step, idx) => (
            <div key={step.number} className="flex-1 flex flex-col md:items-center text-left md:text-center relative group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-heading text-lg font-bold text-white ring-8 ring-background md:mx-auto transition-all duration-300 group-hover:bg-secondary group-hover:scale-110">
                {step.number}
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-textPrimary">
                {step.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-textSecondary md:max-w-[200px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* August Vacation School Banner */}
      <section className="bg-primary relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_80%,#F5A623_25%,transparent_60%)]" />
        <div className="mx-auto max-w-7xl text-center relative z-10">
          <h2 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
            {VACATION_PROGRAM.title}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto font-body text-gray-200">{VACATION_PROGRAM.subtitle}</p>
          <p className="mt-2 font-body text-secondary text-lg font-bold tracking-wider">{VACATION_PROGRAM.dates}</p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
            {VACATION_PROGRAM.fees.map((fee) => (
              <div key={fee.label} className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:bg-white/15">
                <p className="font-body text-xs text-gray-300 uppercase tracking-widest">{fee.label}</p>
                <p className="mt-2 font-heading text-3xl font-extrabold text-secondary">{fee.amount}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 font-body text-sm text-gray-300">
            Subjects offered: <span className="text-white font-semibold">{VACATION_PROGRAM.subjects.join(", ")}</span> &middot; {VACATION_PROGRAM.accommodation}
          </p>
          <div className="mt-8">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-secondary text-primaryDark px-6 py-3 font-semibold font-body text-sm shadow-lg shadow-secondary/20 transition-all hover:bg-white hover:shadow-xl active:scale-95"
            >
              Enquire on WhatsApp: {CONTACT_INFO.whatsapp}
            </a>
          </div>
        </div>
      </section>

      {/* Requirements + Form */}
      <section className="bg-background px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left Column: Requirements & Sidebar */}
          <div className="space-y-10">
            {/* Required Documents Card */}
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-textPrimary">
                  Required Documents
                </h2>
              </div>
              <ul className="mt-6 space-y-4">
                {REQUIRED_DOCUMENTS.map((doc) => (
                  <li key={doc} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <span className="font-body text-sm font-semibold text-textSecondary">{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why Choose STIS? Sidebar Card */}
            <div className="rounded-2xl bg-primaryDark text-white p-8 md:p-10 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_20%_20%,#F5A623_20%,transparent_60%)]" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-secondary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-white">
                  Why Choose STIS?
                </h2>
              </div>
              <p className="mt-4 font-body text-sm text-blue-200 leading-relaxed relative z-10">
                We offer a world-class Cambridge education built on academic excellence and character values.
              </p>
              <ul className="mt-8 space-y-6 relative z-10">
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-secondary">
                    <Check className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-white">Cambridge Curriculum</h4>
                    <p className="mt-1 font-body text-xs text-blue-200">International certification accepted by global universities.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-secondary">
                    <Check className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-white">Individualized Growth</h4>
                    <p className="mt-1 font-body text-xs text-blue-200">Small classroom ratios for optimal teacher support.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-secondary">
                    <Check className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-white">Holistic Development</h4>
                    <p className="mt-1 font-body text-xs text-blue-200">Robust athletics, arts programs, and leadership training.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="rounded-2xl border border-border bg-surface p-8 shadow-lg relative overflow-hidden">
            {/* Subtle background form pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <svg width="100%" height="100%">
                <pattern id="form-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#1B3F7A" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#form-grid)" />
              </svg>
            </div>

            <h2 className="font-heading text-2xl font-bold text-textPrimary relative z-10">
              Request Information
            </h2>
            <p className="mt-2 font-body text-xs text-textSecondary relative z-10">
              Submit your enquiry below and our admissions team will be in touch shortly.
            </p>

            {submitted ? (
              <div className="mt-8 rounded-xl bg-primary/10 p-8 text-center animate-fade-in">
                <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
                <p className="mt-4 font-body text-sm font-bold text-textPrimary">
                  Thank you! Your enquiry has been received.
                </p>
                <p className="mt-2 font-body text-xs text-textSecondary">
                  Our admissions representative will reach out to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-6 relative z-10">
                {error && (
                  <p role="alert" className="rounded-lg bg-red-50 p-4 font-body text-sm text-red-700">
                    {error}
                  </p>
                )}
                <div>
                  <label htmlFor="parentName" className="block font-body text-xs font-semibold text-textPrimary uppercase tracking-wider">
                    Parent / Guardian Name
                  </label>
                  <input
                    id="parentName"
                    name="parentName"
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 font-body text-sm text-textPrimary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-body text-xs font-semibold text-textPrimary uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 font-body text-sm text-textPrimary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block font-body text-xs font-semibold text-textPrimary uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 font-body text-sm text-textPrimary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="grade" className="block font-body text-xs font-semibold text-textPrimary uppercase tracking-wider">
                    Grade Applying For
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-border bg-white px-4 py-3 font-body text-sm text-textPrimary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {GRADE_OPTIONS.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" variant="primary" className="w-full h-12" disabled={isSubmitting} icon={Send}>
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
