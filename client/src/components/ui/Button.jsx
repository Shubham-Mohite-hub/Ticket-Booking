const VARIANT_CLASSES = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  isLoading = false,
  disabled = false,
  className = "",
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;