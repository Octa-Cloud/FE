import React, { useState, forwardRef } from "react";
import EyeIcon from "../assets/eyeIcon.svg";
import CheckIcon from "../assets/checkIcon.svg";

const FormField = forwardRef(({ 
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
}, ref) => {
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
            ref={ref}
            type={isPasswordField && showPassword ? "text" : type}
            className={isPasswordField ? 'password-input' : (showStatusIndicator ? 'form-input form-input-with-status' : 'form-input')}
            id={id}
            name={id}
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
              <img src={EyeIcon} alt="" width="24" height="24" aria-hidden="true" />
            </button>
          )}
          {showStatusIndicator && (
            <div className="form-status-indicator">
              {statusIcon || (
                <img src={CheckIcon} alt="" width="24" height="24" aria-hidden="true" />
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
});

FormField.displayName = 'FormField';

export default FormField;
