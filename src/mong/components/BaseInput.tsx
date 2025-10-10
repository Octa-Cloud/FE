import React, { forwardRef } from "react";

export interface BaseInputProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'tel' | 'date' | 'number';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  maxLength?: number;
  className?: string;
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(({ 
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
  helperText
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
        readOnly={readOnly}
        autoComplete={autoComplete}
        maxLength={maxLength}
      />
      
      {helperText && (
        <p className="form-helper-text">
          {helperText}
        </p>
      )}
    </div>
  );
});

BaseInput.displayName = 'BaseInput';

export default BaseInput;

