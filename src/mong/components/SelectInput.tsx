import React, { useState, useEffect } from "react";

export interface SelectInputProps {
  label: string;
  id: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: Array<{ value: string; label: string }>;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const SelectInput = React.memo<SelectInputProps>(({ 
  label, 
  id, 
  placeholder, 
  value, 
  onChange, 
  options = [],
  required = false,
  disabled = false,
  className = "",
  helperText
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown && !(event.target as Element).closest(`#${id}-container`)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, id]);

  return (
    <div className={`form-field ${className}`}>
      <label 
        className="form-label" 
        htmlFor={id}
      >
        {label}
      </label>
      
      <div className="select-field-wrapper" id={`${id}-container`}>
        <button
          type="button"
          className="select-trigger"
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={disabled}
        >
          <span>{value || placeholder}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="select-arrow"
          >
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </button>
        
        {showDropdown && (
          <div className="select-dropdown">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                className="select-option"
                onClick={() => {
                  onChange({
                    target: {
                      value: option.value
                    }
                  } as React.ChangeEvent<HTMLInputElement>);
                  setShowDropdown(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {helperText && (
        <p className="form-helper-text">
          {helperText}
        </p>
      )}
    </div>
  );
});

SelectInput.displayName = 'SelectInput';

export default SelectInput;

