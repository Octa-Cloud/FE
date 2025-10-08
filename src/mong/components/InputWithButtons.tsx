import React, { forwardRef } from "react";

export interface InputWithButtonsProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'tel';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  className?: string;
  buttons: React.ReactNode; // 필수: 오른쪽에 표시할 버튼들
}

const InputWithButtons = forwardRef<HTMLInputElement, InputWithButtonsProps>(({ 
  label, 
  id, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = false,
  disabled = false,
  autoComplete,
  maxLength,
  className = "",
  helperText,
  buttons
}, ref) => {
  return (
    <div className={`form-field ${className}`}>
      <label 
        className="form-label" 
        htmlFor={id}
      >
        {label}
      </label>
      
      <input
        ref={ref}
        type={type}
        className="form-input"
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
      
      {helperText && (
        <p className="form-helper-text">
          {helperText}
        </p>
      )}
      
      {buttons && (
        <div className="signup-buttons-container">
          {buttons}
        </div>
      )}
    </div>
  );
});

InputWithButtons.displayName = 'InputWithButtons';

export default InputWithButtons;

