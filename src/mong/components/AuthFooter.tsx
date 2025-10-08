import React from "react";
import { AuthFooterProps } from "../types";

export default function AuthFooter({ 
  text, 
  linkText, 
  onLinkClick,
  className = ""
}: AuthFooterProps) {
  return (
    <div className={`text-center auth-footer ${className}`}>
      <p className="text-gray-400 m-0 text-sm leading-relaxed">
        {text}{" "}
        <button 
          type="button"
          onClick={onLinkClick}
          className="auth-footer-link bg-transparent border-0 font-semibold text-base cursor-pointer no-underline relative"
        >
          {linkText}
        </button>
      </p>
    </div>
  );
}
