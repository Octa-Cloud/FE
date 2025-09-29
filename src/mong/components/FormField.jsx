import React, { useState } from "react";

export default function FormField({ 
  label, 
  id, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = false,
  disabled = false,
  readOnly = false,
  autoComplete,
  maxLength,
  className = "",
  helperText,
  children,
  showPasswordToggle = false,
  buttons = null,
  showStatusIndicator = false,
  statusIcon = null
}) {
  const [showPassword, setShowPassword] = useState(false);

  // 비밀번호 필드인지 확인
  const isPasswordField = type === "password" || showPasswordToggle;

  return (
    <div className={`form-field ${isPasswordField ? 'password-field' : ''} ${className}`}>
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      {children || (
        <div className={isPasswordField ? 'password-container' : (showStatusIndicator ? 'form-input-group' : '')}>
          <input
            type={isPasswordField && showPassword ? "text" : type}
            className={isPasswordField ? 'password-input' : (showStatusIndicator ? 'form-input form-input-with-status' : 'form-input')}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            readOnly={readOnly}
            autoComplete={autoComplete}
            maxLength={maxLength}
          />
          {isPasswordField && (
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
          )}
          {showStatusIndicator && (
            <div className="form-status-indicator">
              {statusIcon || (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
              )}
            </div>
          )}
        </div>
      )}
      {helperText && (
        <p className="form-helper-text">{helperText}</p>
      )}
      {buttons && (
        <div className="form-field-buttons">
          {buttons}
        </div>
      )}
    </div>
  );
}
