const Card = ({ image, imageAlt = "", title, description, icon: Icon, children, className = "" }) => {
  return (
    <div
      className={`group overflow-hidden rounded-2xl border border-border bg-surface shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(13,31,69,0.2)] border-t-4 border-t-transparent hover:border-t-secondary ${className}`}
    >
      {image && (
        <div className="overflow-hidden">
          <img src={image} alt={imageAlt} className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      )}

      <div className="p-6">
        {Icon && (
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
        )}

        {title && (
          <h3 className="font-heading text-lg font-semibold text-textPrimary">
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