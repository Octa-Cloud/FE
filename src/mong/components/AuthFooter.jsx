import React from "react";

export default function AuthFooter({ 
  text, 
  linkText, 
  onLinkClick,
  className = ""
}) {
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
