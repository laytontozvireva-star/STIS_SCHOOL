const Hero = ({ title, subtitle, backgroundImage, children, className = "" }) => {
  return (
    <section
      className={`relative flex min-h-[480px] lg:min-h-[560px] items-center justify-center overflow-hidden ${
        backgroundImage ? "bg-cover bg-center" : "bg-gradient-to-br from-primaryDark via-primary to-[#2a5497]"
      } ${className}`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {backgroundImage && (
        <div className="absolute inset-0 bg-primaryDark/70 mix-blend-multiply" aria-hidden="true" />
      )}

      {/* Decorative background glow */}
      {!backgroundImage && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-3xl" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        {title && (
          <h1 className="animate-slide-up font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-sm">
            {title}
          </h1>
        )}

        {subtitle && (
          <p className="animate-slide-up-delay-1 mt-6 font-body text-lg text-gray-200 sm:text-xl drop-shadow-sm max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}

        {children && (
          <div className="animate-slide-up-delay-2 mt-10 flex flex-col sm:flex-row justify-center gap-4">
            {children}
          </div>
        )}
      </div>

      {/* Bottom Wave SVG */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none text-background">
        <svg
          className="relative block w-full h-[40px] sm:h-[60px] lg:h-[80px]"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.42,120.7,192.5,108.6,238.16,99.64,281.82,75.31,321.39,56.44Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;