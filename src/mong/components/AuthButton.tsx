import React from "react";
import { AuthButtonProps } from "../types";

const AuthButton = React.memo<AuthButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>>(({ 
  children, 
  type = "button", 
  onClick, 
  disabled = false,
  variant = "primary", // primary, secondary
  className = "",
  ...props
}) => {
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
});

AuthButton.displayName = 'AuthButton';

export default AuthButton;
