import { Link } from "react-router-dom";

const VARIANT_CLASSES = {
  primary: "bg-gradient-to-r from-primary to-[#15305c] text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5",
  secondary: "bg-gradient-to-r from-secondary to-[#e59b20] text-white shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 hover:-translate-y-0.5",
  outline: "bg-transparent text-primary border-2 border-primary hover:bg-primary/5 hover:shadow-md",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold font-body transition-all duration-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const Button = ({
  children,
  variant = "primary",
  to,
  href,
  type = "button",
  onClick,
  className = "",
  disabled = false,
  ...rest
}) => {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`;

  // Internal route link
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  // External link
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  // Default: actual button (forms, actions)
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...rest}>
      {children}
    </button>
  );
};

export default Button;