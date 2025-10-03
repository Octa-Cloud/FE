import React from "react";
import { AuthFooterProps } from "../types";

export default function AuthFooter({ 
  text, 
  linkText, 
  onLinkClick,
  className = ""
}: AuthFooterProps) {
  return (
    <div className={`auth-footer ${className}`}>
      <p>
        {text}{" "}
        <button 
          type="button"
          onClick={onLinkClick}
          className="auth-footer-link"
        >
          {linkText}
        </button>
      </p>
    </div>
  );
}
