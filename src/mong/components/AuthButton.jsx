import React from "react";

export default function AuthButton({ 
  children, 
  type = "button", 
  onClick, 
  disabled = false,
  variant = "primary", // primary, secondary
  className = "",
  ...props
}) {
  const baseClass = variant === "primary" ? "auth-button" : "auth-button-secondary";
  
  return (
    <button
      type={type}
      className={`${baseClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
