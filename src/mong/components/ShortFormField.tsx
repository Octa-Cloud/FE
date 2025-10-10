import React, { useState, useEffect } from "react";
import EyeIcon from "../assets/eyeIcon.svg";
import { ShortFormFieldProps } from "../types";

const ShortFormField = React.memo<ShortFormFieldProps>(({ 
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
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // 비밀번호 필드인지 확인
  const isPasswordField = type === "password" || showPasswordToggle;
  
  // 드롭다운 필드인지 확인
  const isDropdownField = options.length > 0;
  

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (isDropdownField) {
      const handleClickOutside = (event: MouseEvent) => {
        if (showDropdown && !(event.target as Element).closest('.short-form-select-container')) {
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
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="flex items-center gap-2 font-medium text-base select-none form-label" htmlFor={id}>
        {label}
      </label>
      
      {/* 드롭다운 필드 */}
      {isDropdownField ? (
        <div className="relative">
          <button
            type="button"
            className="short-form-select-trigger w-full h-12 px-3 flex items-center justify-between cursor-pointer outline-none"
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
              className="w-4 h-4 opacity-50"
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </button>
          {showDropdown && (
            <div className="short-form-dropdown-menu absolute top-full left-0 right-0 z-10 mt-1">
              {options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  className="short-form-dropdown-item w-full py-3 px-4 bg-transparent border-0 text-left cursor-pointer"
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
      ) : (
        // 일반 입력 필드 (비밀번호 포함)
        <div className={isPasswordField ? 'relative' : ''}>
          <input
            type={isPasswordField && showPassword ? "text" : type}
            className={isPasswordField ? 'short-form-password-input w-full h-12 py-3 pr-12 pl-3 rounded-md text-base outline-none' : 'short-form-input w-full h-12 p-3 rounded-md text-base outline-none'}
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
              className="short-form-password-toggle absolute right-0 top-0 h-12 px-3 bg-transparent border-0 cursor-pointer flex items-center justify-center rounded-md"
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
        <p className="text-sm text-gray-400 m-0">{helperText}</p>
      )}
    </div>
  );
});

ShortFormField.displayName = 'ShortFormField';

export default ShortFormField;
