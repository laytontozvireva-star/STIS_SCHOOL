import { useLocation, Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import defaultHeroImage from "../assets/images/stis-campus.webp";

const Hero = ({ title, subtitle, backgroundImage, children, className = "", stats = null }) => {
  const heroImage = backgroundImage || defaultHeroImage;
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const isHome = location.pathname === "/";

  return (
    <section
      className={`relative isolate overflow-hidden bg-primaryDark py-24 sm:py-28 lg:py-36 ${className}`}
    >
      <div
        className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat opacity-65"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

            <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(13,31,69,0.96)_0%,rgba(13,31,69,0.84)_42%,rgba(13,31,69,0.50)_72%,rgba(13,31,69,0.30)_100%)]" aria-hidden="true" />
      <div className="absolute -left-20 top-0 -z-10 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" aria-hidden="true" />
      <div className="absolute right-[10%] top-[18%] -z-10 h-64 w-64 rounded-full bg-blue-400/15 blur-3xl" aria-hidden="true" />
      <div className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full border border-white/15" aria-hidden="true" />
      <div className="absolute -right-12 bottom-[-7rem] -z-10 h-80 w-80 rounded-full border-[24px] border-secondary/30" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl py-10 text-left sm:py-14">
          <div className="animate-fade-in mb-5 h-1 w-14 rounded-full bg-secondary" />
          {title && (
            <h1 className="animate-slide-up font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="animate-slide-up-delay-1 mt-5 max-w-2xl font-body text-base leading-relaxed text-blue-100 sm:text-lg">
              {subtitle}
            </p>
          )}

          {/* Breadcrumbs */}
          {!isHome && pathnames.length > 0 && (
            <nav className="animate-slide-up-delay-1 mt-6 flex text-xs text-blue-200" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 font-body font-medium uppercase tracking-wider">
                <li className="inline-flex items-center">
                  <Link to="/" className="hover:text-white transition-colors duration-200">
                    Home
                  </Link>
                </li>
                {pathnames.map((value, index) => {
                  const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                  const isLast = index === pathnames.length - 1;
                  const displayName = value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ");
                  return (
                    <li key={to} className="flex items-center">
                      <ChevronRight className="mx-1 h-3.5 w-3.5 text-blue-300" />
                      {isLast ? (
                        <span className="text-secondary">{displayName}</span>
                      ) : (
                        <Link to={to} className="hover:text-white transition-colors duration-200">
                          {displayName}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          {children && (
            <div className="animate-slide-up-delay-2 mt-8 flex flex-col gap-4 sm:flex-row">
              {children}
            </div>
          )}
        </div>

        {/* Stats bar */}
        {stats && (
          <div className="animate-slide-up-delay-3 mt-10 max-w-2xl border-l-2 border-secondary bg-primaryDark/85 p-4 text-left shadow-lg">
            <div className="flex flex-wrap items-center justify-around gap-y-2 gap-x-4 divide-x divide-white/10 text-white font-body">
              {stats.map((stat, idx) => (
                <div key={idx} className={`flex-1 min-w-[100px] ${idx > 0 ? "pl-2" : ""}`}>
                  <p className="text-xs text-blue-200 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-lg font-bold text-secondary mt-0.5">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Homepage Scroll-down Indicator */}
      {isHome && (
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce flex flex-col items-center cursor-pointer select-none"
          onClick={() => window.scrollTo({ top: window.innerHeight - 80, behavior: 'smooth' })}
        >
          <span className="text-[10px] tracking-widest text-blue-200 mb-1 font-body font-semibold uppercase">Scroll Down</span>
          <ChevronDown className="h-5 w-5 text-secondary" />
        </div>
      )}

      <div className="absolute bottom-0 left-0 h-1 w-full bg-secondary" aria-hidden="true" />
    </section>
  );
};

export default Hero;