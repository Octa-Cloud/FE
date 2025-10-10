import React, { useState, forwardRef } from "react";
import EyeIcon from "../assets/eyeIcon.svg";
import CheckIcon from "../assets/checkIcon.svg";
import { FormFieldProps } from "../types";

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(({ 
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
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // 비밀번호 필드인지 확인
  const isPasswordField = type === "password" || showPasswordToggle;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="flex items-center gap-2 font-medium text-base select-none form-label" htmlFor={id}>
        {label}
      </label>
      {children || (
        <div className={isPasswordField ? 'relative' : (showStatusIndicator ? 'flex gap-3' : '')}>
          <input
            ref={ref}
            type={isPasswordField && showPassword ? "text" : type}
            className={isPasswordField ? 'password-input w-full h-12 py-3 pr-12 pl-3 rounded-md text-base outline-none' : (showStatusIndicator ? 'form-input flex-1 w-full h-12 px-4 text-base font-normal outline-none' : 'form-input w-full h-12 px-4 text-base font-normal outline-none')}
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
              className="password-toggle absolute right-0 top-0 h-12 px-3 bg-transparent border-0 cursor-pointer flex items-center justify-center rounded-md"
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              <img src={EyeIcon} alt="" width="24" height="24" aria-hidden="true" />
            </button>
          )}
          {showStatusIndicator && (
            <div className="form-status-indicator flex items-center px-4 h-12">
              {statusIcon || (
                <img src={CheckIcon} alt="" width="20" height="20" aria-hidden="true" className="w-5 h-5" />
              )}
            </div>
          )}
        </div>
      )}
      {helperText && (
        <p className="text-sm text-gray-400 mt-1 mb-0 whitespace-pre-line">{helperText}</p>
      )}
      {buttons && (
        <div className="flex gap-3 mt-3">
          {buttons}
        </div>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;
