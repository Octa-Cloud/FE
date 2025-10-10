import React from "react";
import CheckIcon from "../assets/checkIcon.svg";

export interface VerifiedInputProps {
  label: string;
  id: string;
  type?: 'text' | 'email';
  value: string;
  helperText?: string;
  statusIcon?: React.ReactNode;
  className?: string;
}

const VerifiedInput = React.memo<VerifiedInputProps>(({ 
  label, 
  id, 
  type = "text",
  value, 
  className = "",
  helperText,
  statusIcon = null
}) => {
  return (
    <div className={`form-field ${className}`}>
      <label 
        className="form-label" 
        htmlFor={id}
      >
        {label}
      </label>
      
      <div className="verified-input-wrapper">
        <input
          type={type}
          className="verified-input"
          id={id}
          name={id}
          value={value}
          disabled={true}
          readOnly={true}
        />
        
        <div className="form-status-indicator">
          {statusIcon || (
            <img src={CheckIcon} alt="verified" width="20" height="20" aria-hidden="true" />
          )}
        </div>
      </div>
      
      {helperText && (
        <p className="form-helper-text">
          {helperText}
        </p>
      )}
    </div>
  );
});

VerifiedInput.displayName = 'VerifiedInput';

export default VerifiedInput;

