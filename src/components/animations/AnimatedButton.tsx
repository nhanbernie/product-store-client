import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { buttonHover, getReducedMotionVariants } from "../../utils/animations";

interface AnimatedButtonProps
  extends Omit<HTMLMotionProps<"button">, "variants"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  as?: React.ElementType;
  to?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  as: Component = "button",
  ...props
}) => {
  const variants = getReducedMotionVariants(buttonHover);

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 focus:ring-emerald-500",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-emerald-500",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const combinedClassName = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <motion.div
      variants={variants}
      initial="initial"
      whileHover={!disabled && !loading ? "hover" : undefined}
      whileTap={!disabled && !loading ? "tap" : undefined}
      className={combinedClassName}
      as={Component}
      {...props}
    >
      {loading && (
        <motion.div
          className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      {children}
    </motion.div>
  );
};

export default AnimatedButton;
