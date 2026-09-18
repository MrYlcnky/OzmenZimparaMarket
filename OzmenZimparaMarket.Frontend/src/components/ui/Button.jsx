const varyantlar = {
  primary: "bg-brand-blue text-white hover:bg-brand-blue-dark",

  secondary: "bg-brand-purple text-white hover:bg-brand-purple-dark",

  outline:
    "border border-border bg-transparent text-text-primary hover:bg-surface-soft",

  ghost: "bg-transparent text-text-primary hover:bg-surface-soft",

  danger: "bg-danger text-white hover:opacity-90",
};

const boyutlar = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-ui font-semibold
        transition duration-200 ease-premium
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-brand-blue
        focus-visible:ring-offset-2
        disabled:pointer-events-none
        disabled:opacity-50
        ${varyantlar[variant]}
        ${boyutlar[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
