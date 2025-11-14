import Link from "next/link";
import { ButtonProps, ButtonAsLink, ButtonAsButton } from "../types/types";

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  icon,
  iconPosition = "right",
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-3 font-medium transition-colors rounded-full px-6";
  
  const variantClasses = {
    primary: "bg-[#0fdac2] text-[#020016] hover:bg-[#0ec5b0]",
    secondary: "bg-[#643bff] text-white hover:bg-[#7c5aff]",
    outline: "border-2 border-[#0fdac2] text-[#0fdac2] hover:bg-[#0fdac2] hover:text-[#020016]",
    dark: "bg-[#020016] text-white hover:bg-[#0a0a1a]",
    light: "bg-white text-[#020016] hover:bg-gray-100",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const iconElement = icon && (
    <span>{icon}</span>
  );

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...linkProps } = props as ButtonAsLink;
    return (
      <Link href={href} className={combinedClasses} {...linkProps}>
        {iconPosition === "left" && iconElement}
        {children}
        {iconPosition === "right" && iconElement}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={combinedClasses} {...buttonProps}>
      {iconPosition === "left" && iconElement}
      {children}
      {iconPosition === "right" && iconElement}
    </button>
  );
}

