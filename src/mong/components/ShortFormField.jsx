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
  showCalendar = false,
  calendarPosition = 'bottom',
  currentCalendarDate,
  onCalendarDateSelect,
  onCalendarMonthChange,
  onToggleCalendar
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [internalShowCalendar, setInternalShowCalendar] = useState(false);
  const [internalCalendarDate, setInternalCalendarDate] = useState(currentCalendarDate || new Date());

  // 비밀번호 필드인지 확인
  const isPasswordField = type === "password" || showPasswordToggle;
  
  // 드롭다운 필드인지 확인
  const isDropdownField = options.length > 0;
  
  // 달력 필드인지 확인
  const isCalendarField = showCalendar;

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

  // 달력에서 날짜 선택
  const handleCalendarDateSelect = (day) => {
    const month = (internalCalendarDate.getMonth() + 1).toString().padStart(2, '0');
    const year = internalCalendarDate.getFullYear().toString();
    const dayStr = day.toString().padStart(2, '0');
    
    onChange({
      target: {
        value: {
          month,
          day: dayStr,
          year
        }
      }
    });
    
    setInternalShowCalendar(false);
  };

  // 달력 월 변경
  const changeCalendarMonth = (direction) => {
    setInternalCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // 달력 토글
  const toggleCalendar = () => {
    setInternalShowCalendar(prev => !prev);
  };

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
      ) : isCalendarField ? (
        // 달력 필드
        <div className="short-form-date-container">
          <input
            type="text"
            className="short-form-date-input"
            placeholder="MM"
            maxLength="2"
            value={value?.month || ''}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9]/g, '');
              if (numericValue === '' || (parseInt(numericValue) >= 1 && parseInt(numericValue) <= 12)) {
                onChange({
                  target: {
                    value: {
                      ...(value || {}),
                      month: numericValue
                    }
                  }
                });
              }
            }}
            onBlur={(e) => {
              const val = e.target.value;
              if (val && parseInt(val) < 10) {
                onChange({
                  target: {
                    value: {
                      ...(value || {}),
                      month: val.padStart(2, '0')
                    }
                  }
                });
              }
            }}
            required={required}
          />
          <span className="short-form-date-separator">/</span>
          <input
            type="text"
            className="short-form-date-input"
            placeholder="DD"
            maxLength="2"
            value={value?.day || ''}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9]/g, '');
              if (numericValue === '' || (parseInt(numericValue) >= 1 && parseInt(numericValue) <= 31)) {
                onChange({
                  target: {
                    value: {
                      ...(value || {}),
                      day: numericValue
                    }
                  }
                });
              }
            }}
            onBlur={(e) => {
              const val = e.target.value;
              if (val && parseInt(val) < 10) {
                onChange({
                  target: {
                    value: {
                      ...(value || {}),
                      day: val.padStart(2, '0')
                    }
                  }
                });
              }
            }}
            required={required}
          />
          <span className="short-form-date-separator">/</span>
          <input
            type="text"
            className="short-form-date-input"
            placeholder="YYYY"
            maxLength="4"
            value={value?.year || ''}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/[^0-9]/g, '');
              if (numericValue.length <= 4) {
                onChange({
                  target: {
                    value: {
                      ...(value || {}),
                      year: numericValue
                    }
                  }
                });
              }
            }}
            onBlur={(e) => {
              const val = e.target.value;
              if (val && val.length === 4) {
                const year = parseInt(val);
                if (year >= 1900 && year <= 2024) {
                  onChange({
                    target: {
                      value: {
                        ...(value || {}),
                        year: val
                      }
                    }
                  });
                } else {
                  onChange({
                    target: {
                      value: {
                        ...(value || {}),
                        year: ''
                      }
                    }
                  });
                }
              } else if (val && val.length < 4) {
                onChange({
                  target: {
                    value: {
                      ...(value || {}),
                      year: ''
                    }
                  }
                });
              }
            }}
            required={required}
          />
          <button
            type="button"
            className="short-form-calendar-button"
            onClick={toggleCalendar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>
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
      
      {/* 달력 렌더링 */}
      {isCalendarField && internalShowCalendar && (
        <div className={`signup-calendar ${calendarPosition === 'top' ? 'signup-calendar-top' : 'signup-calendar-bottom'}`}>
          <div className="signup-calendar-header">
            <button
              type="button"
              className="signup-calendar-nav"
              onClick={() => changeCalendarMonth(-1)}
            >
              ‹
            </button>
            <span className="signup-calendar-month">
              {internalCalendarDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
            </span>
            <button
              type="button"
              className="signup-calendar-nav"
              onClick={() => changeCalendarMonth(1)}
            >
              ›
            </button>
          </div>
          <div className="signup-calendar-grid">
            <div className="signup-calendar-weekday">일</div>
            <div className="signup-calendar-weekday">월</div>
            <div className="signup-calendar-weekday">화</div>
            <div className="signup-calendar-weekday">수</div>
            <div className="signup-calendar-weekday">목</div>
            <div className="signup-calendar-weekday">금</div>
            <div className="signup-calendar-weekday">토</div>
            {(() => {
              const year = internalCalendarDate.getFullYear();
              const month = internalCalendarDate.getMonth();
              const firstDay = new Date(year, month, 1);
              const startDate = new Date(firstDay);
              startDate.setDate(startDate.getDate() - firstDay.getDay());

              const days = [];
              for (let i = 0; i < 42; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                const day = date.getDate();
                const isCurrentMonth = date.getMonth() === month;
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = isCurrentMonth &&
                  value?.month && value?.day && value?.year &&
                  value.month === (month + 1).toString().padStart(2, '0') &&
                  value.day === day.toString().padStart(2, '0') &&
                  value.year === year.toString();

                days.push(
                  <button
                    key={i}
                    type="button"
                    className={`signup-calendar-day ${!isCurrentMonth ? 'signup-calendar-day-other' : ''} ${isToday ? 'signup-calendar-day-today' : ''} ${isSelected ? 'signup-calendar-day-selected' : ''}`}
                    onClick={() => {
                      if (isCurrentMonth) {
                        handleCalendarDateSelect(day);
                      }
                    }}
                    disabled={!isCurrentMonth}
                  >
                    {day}
                  </button>
                );
              }
              return days;
            })()}
          </div>
        </div>
      )}
      
      {helperText && (
        <p className="short-form-helper-text">{helperText}</p>
      )}
    </div>
  );
}
