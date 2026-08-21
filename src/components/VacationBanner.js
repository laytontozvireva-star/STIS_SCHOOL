import { useEffect, useState } from "react";
import { Calendar, BookOpen, DollarSign, Home, Phone } from "lucide-react";
import Button from "./Button";
import LikeButton from "./LikeButton";
import { VACATION_PROGRAM, CONTACT_INFO } from "../utils/constants";
import { getActiveVacationPost } from "../services/vacationPostsService";
import bannerImage from "../assets/images/august-vacation-banner.webp";

const VacationBanner = () => {
  const whatsappUrl = `https://wa.me/263${CONTACT_INFO.whatsapp.replace(/^0/, "").replace(/\D/g, "")}`;
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    getActiveVacationPost().then(setActivePost).catch(() => setActivePost(null));
  }, []);

  const program = activePost ? {
    title: activePost.title,
    subtitle: `${activePost.term} - ${(activePost.subjects || []).join(", ")}`,
    dates: activePost.dates,
    subjects: activePost.subjects || [],
    fees: activePost.fees || [],
    accommodation: activePost.accommodation,
    image: activePost.image_url || bannerImage,
  } : { ...VACATION_PROGRAM, image: bannerImage };

  return (
    <section className="relative my-6 overflow-hidden rounded-3xl bg-gradient-to-br from-primaryDark via-primary to-[#2a5497] px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center mb-10 animate-slide-up">
          <span className="inline-block rounded-full bg-secondary/20 px-4 py-1 font-body text-sm font-semibold uppercase tracking-wider text-secondary">
            Now Enrolling
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl">
            {program.title}
          </h2>
          <p className="mt-3 font-body text-lg text-gray-200">
            {program.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="order-1 space-y-6 animate-slide-up-delay-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="group rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl hover:shadow-black/20">
                <div className="mb-4 inline-flex rounded-xl bg-secondary/20 p-2.5 text-secondary transition-colors group-hover:bg-secondary group-hover:text-primaryDark">
                  <Calendar className="h-5 w-5" />
                </div>
                <p className="font-heading text-xs font-bold uppercase tracking-wider text-secondary/90 group-hover:text-white transition-colors">
                  Dates
                </p>
                <p className="mt-2 font-body text-base font-medium text-white">{program.dates}</p>
              </div>

              <div className="group rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl hover:shadow-black/20">
                <div className="mb-4 inline-flex rounded-xl bg-secondary/20 p-2.5 text-secondary transition-colors group-hover:bg-secondary group-hover:text-primaryDark">
                  <BookOpen className="h-5 w-5" />
                </div>
                <p className="font-heading text-xs font-bold uppercase tracking-wider text-secondary/90 group-hover:text-white transition-colors">
                  Subjects
                </p>
                <p className="mt-2 font-body text-base font-medium text-white">
                  {program.subjects.join(" · ")}
                </p>
              </div>

              <div className="group rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl hover:shadow-black/20">
                <div className="mb-4 inline-flex rounded-xl bg-secondary/20 p-2.5 text-secondary transition-colors group-hover:bg-secondary group-hover:text-primaryDark">
                  <DollarSign className="h-5 w-5" />
                </div>
                <p className="font-heading text-xs font-bold uppercase tracking-wider text-secondary/90 group-hover:text-white transition-colors">
                  Fees
                </p>
                <ul className="mt-2 space-y-1.5 font-body text-sm text-gray-200">
                  {program.fees.map((fee) => (
                    <li key={fee.label} className="flex justify-between border-b border-white/10 pb-1 last:border-0 last:pb-0">
                      <span>{fee.label}</span>
                      {fee.amount ? <span className="font-semibold text-white">{fee.amount}</span> : null}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="group rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-xl hover:shadow-black/20">
                <div className="mb-4 inline-flex rounded-xl bg-secondary/20 p-2.5 text-secondary transition-colors group-hover:bg-secondary group-hover:text-primaryDark">
                  <Home className="h-5 w-5" />
                </div>
                <p className="font-heading text-xs font-bold uppercase tracking-wider text-secondary/90 group-hover:text-white transition-colors">
                  Accommodation
                </p>
                <p className="mt-2 font-body text-base font-medium text-white">{program.accommodation}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center mt-8">
              <Button variant="secondary" to="/admissions" className="shadow-lg shadow-secondary/20 hover:shadow-secondary/40 hover:-translate-y-0.5 transition-all">
                Register Now
              </Button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-body text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-lg"
              >
                <Phone className="h-4 w-4 transition-transform group-hover:scale-110" />
                WhatsApp {CONTACT_INFO.whatsapp}
              </a>
            </div>

            {/* Like / Dislike — only for live DB posts */}
            {activePost?.id && (
              <div className="mt-4">
                <LikeButton contentType="vacation_post" contentId={activePost.id} />
              </div>
            )}
          </div>

          <figure className="order-2 mx-auto w-full max-w-md animate-slide-up-delay-1 lg:justify-self-end">
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl shadow-primaryDark/40 backdrop-blur-sm sm:p-4">
              <div className="overflow-hidden rounded-[1.35rem] bg-white">
                <img
                  src={program.image}
                  alt={`${program.title} promotional flyer`}
                  className="block h-auto w-full"
                />
              </div>
            </div>
            <figcaption className="mt-4 text-center font-body text-sm text-gray-200">
              August Vacation School 2026 ? limited spaces available.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default VacationBanner;

