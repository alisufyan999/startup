import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

// Button Types
export type ButtonVariant = "primary" | "secondary" | "outline" | "dark" | "light";
export type ButtonSize = "sm" | "md" | "lg";

export interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export interface ButtonAsButton extends BaseButtonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: never;
}

export interface ButtonAsLink extends BaseButtonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children"> {
  href: string;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink;

// Container Types
export interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

// HeroBanner Types
export interface HeroBannerProps {
  headline: string;
  headlineHighlight?: string;
  subheadline?: string;
  description: string;
  ctaButton: {
    text: string;
    href: string;
    variant?: ButtonVariant;
  };
  className?: string;
}

