import React, { useState, useEffect } from "react";
import EyeIcon from "../assets/eyeIcon.svg";

export default function ShortFormField({ 
  label, 
  id, 
  name,
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
  options = [], // 드롭다운 옵션
  showPasswordToggle = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // 비밀번호 필드인지 확인
  const isPasswordField = type === "password" || showPasswordToggle;
  
  // 드롭다운 필드인지 확인
  const isDropdownField = options.length > 0;
  

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (isDropdownField) {
      const handleClickOutside = (event) => {
        if (showDropdown && !event.target.closest('.short-form-select-container')) {
          setShowDropdown(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showDropdown, isDropdownField]);


  return (
    <div className={`short-form-field ${className}`}>
      <label className="short-form-label" htmlFor={id}>
        {label}
      </label>
      
      {/* 드롭다운 필드 */}
      {isDropdownField ? (
        <div className="short-form-select-container">
          <button
            type="button"
            className="short-form-select-trigger"
            onClick={() => setShowDropdown(!showDropdown)}
            disabled={disabled}
          >
            <span>{value || placeholder}</span>
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
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </button>
          {showDropdown && (
            <div className="short-form-dropdown-menu">
              {options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  className="short-form-dropdown-item"
                  onClick={() => {
                    onChange({
                      target: {
                        value: option.value
                      }
                    });
                    setShowDropdown(false);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        // 일반 입력 필드 (비밀번호 포함)
        <div className={isPasswordField ? 'short-form-password-container' : ''}>
          <input
            type={isPasswordField && showPassword ? "text" : type}
            className={isPasswordField ? 'short-form-password-input' : 'short-form-input'}
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
              className="short-form-password-toggle"
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              <img src={EyeIcon} alt="" width="24" height="24" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
      
      
      {helperText && (
        <p className="short-form-helper-text">{helperText}</p>
      )}
    </div>
  );
}
