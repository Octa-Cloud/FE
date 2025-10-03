import React from "react";
import { AuthButtonProps } from "../types";

export default function AuthButton({ 
  children, 
  type = "button", 
  onClick, 
  disabled = false,
  variant = "primary", // primary, secondary
  className = "",
  ...props
}: AuthButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseClasses = variant === "primary" 
    ? "auth-button w-full py-3 px-6 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg" 
    : "auth-button-secondary w-full py-3 px-6 bg-white text-primary-500 font-medium rounded-lg border-2 border-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg";
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
