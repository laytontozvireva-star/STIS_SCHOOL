const Card = ({ 
  image, 
  imageAlt = "", 
  title, 
  description, 
  icon: Icon, 
  category,
  animateClass = "",
  children, 
  className = "" 
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(13,31,69,0.2)] ${animateClass} ${className}`}
    >
      {/* Left accent stripe on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-secondary to-accent transition-transform duration-300 scale-y-0 origin-top group-hover:scale-y-100" />

      {image && (
        <div className="relative overflow-hidden">
          <img 
            src={image} 
            alt={imageAlt} 
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          {category && (
            <span className="absolute top-4 left-4 rounded-lg bg-primaryDark/80 px-2.5 py-1 text-[10px] font-bold font-body uppercase tracking-wider text-white backdrop-blur-sm shadow">
              {category}
            </span>
          )}
        </div>
      )}

      <div className="p-6">
        {Icon && (
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
        )}

        {title && (
          <h3 className="font-heading text-lg font-semibold text-textPrimary transition-colors duration-300 group-hover:text-primary">
            {title}
          </h3>
        )}

        {description && (
          <p className="mt-2 font-body text-sm leading-relaxed text-textSecondary">
            {description}
          </p>
        )}

        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};

export default Card;