import defaultHeroImage from "../assets/images/stis-campus.webp";

const Hero = ({ title, subtitle, backgroundImage, children, className = "" }) => {
  const heroImage = backgroundImage || defaultHeroImage;

  return (
    <section
      className={`relative isolate overflow-hidden bg-primaryDark py-20 sm:py-24 lg:py-28 ${className}`}
    >
      <div
        className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat opacity-70"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_20%,rgba(245,166,35,0.18),transparent_26%),radial-gradient(circle_at_85%_65%,rgba(69,113,178,0.25),transparent_32%),linear-gradient(120deg,rgba(13,31,69,0.58)_0%,rgba(27,63,122,0.50)_56%,rgba(37,79,142,0.44)_100%)]" aria-hidden="true" />
      <div className="absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full border border-white/10" aria-hidden="true" />
      <div className="absolute -right-12 bottom-[-7rem] -z-10 h-80 w-80 rounded-full border-[24px] border-secondary/20" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/15 bg-white/[0.07] px-6 py-10 text-center shadow-2xl shadow-primaryDark/30 backdrop-blur-sm sm:px-12 sm:py-12">
          <div className="animate-fade-in mx-auto mb-5 h-1 w-14 rounded-full bg-secondary" />
          {title && (
            <h1 className="animate-slide-up font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="animate-slide-up-delay-1 mx-auto mt-5 max-w-2xl font-body text-base leading-relaxed text-blue-100 sm:text-lg">
              {subtitle}
            </p>
          )}
          {children && (
            <div className="animate-slide-up-delay-2 mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              {children}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-1 w-full bg-secondary" aria-hidden="true" />
    </section>
  );
};

export default Hero;