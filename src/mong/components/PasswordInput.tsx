import React, { useState, forwardRef } from "react";
import EyeIcon from "../assets/eyeIcon.svg";

export interface PasswordInputProps {
  label: string;
  id: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  className?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({ 
  label, 
  id, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  disabled = false,
  autoComplete,
  maxLength,
  className = "",
  helperText
}, ref) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className={`form-field ${className}`}>
      <label 
        className="form-label" 
        htmlFor={id}
      >
        {label}
      </label>
      
      <div className="relative">
        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className="password-input"
          id={id}
          name={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
        />
        
        <button
          className="password-toggle"
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
        >
          <img src={EyeIcon} alt="" width="24" height="24" aria-hidden="true" />
        </button>
      </div>
      
      {helperText && (
        <p className="form-helper-text">
          {helperText}
        </p>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;

