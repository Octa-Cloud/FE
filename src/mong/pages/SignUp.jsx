// SignupCard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moonIcon from "../assets/moonIcon.svg";
import "../styles/signup.css";

export default function SignupCard() {
  const navigate = useNavigate();
  
  // 단계 관리
  const [currentStep, setCurrentStep] = useState(1);
  
  // 폼 데이터
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    name: "",
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    gender: "",
    password: "",
    confirmPassword: ""
  });
  
  // UI 상태
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationValid, setVerificationValid] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState('bottom');
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [showResendMessage, setShowResendMessage] = useState(false);

  // 이메일 포맷 검증
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 이메일 입력 처리
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(formData.email)) {
      setEmailValid(true);
      setVerificationSent(true);
      setCurrentStep(2);
    }
  };

  // 인증번호 입력 처리
  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    if (formData.verificationCode.length === 6) {
      setVerificationValid(true);
      setCurrentStep(3);
    }
  };

  // 재전송 버튼 클릭
  const handleResendClick = () => {
    setShowResendMessage(true);
    // 실제로는 여기서 재전송 API 호출
    console.log("인증번호 재전송:", formData.email);
  };

  // 최종 제출
  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: 제출 로직 연결
    console.log("Final submit:", formData);
  };

  // 입력값 변경 처리
  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      // 생년월일 필드가 모두 입력되면 달력 날짜 업데이트
      if (field === 'birthMonth' || field === 'birthDay' || field === 'birthYear') {
        const { birthMonth, birthDay, birthYear } = newData;
        if (birthMonth && birthDay && birthYear) {
          const month = parseInt(birthMonth);
          const day = parseInt(birthDay);
          const year = parseInt(birthYear);
          
          // 유효한 날짜인지 확인
          if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900 && year <= 2024) {
            const newDate = new Date(year, month - 1, day);
            if (!isNaN(newDate.getTime())) {
              setCurrentCalendarDate(newDate);
            }
          }
        }
      }
      
      return newData;
    });
  };

  // 달력 위치 계산
  const calculateCalendarPosition = () => {
    const dateContainer = document.querySelector('.signup-date-container');
    if (dateContainer) {
      const rect = dateContainer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // 달력 높이를 고려하여 위치 결정 (약 320px)
      if (spaceBelow < 320 && spaceAbove > spaceBelow) {
        setCalendarPosition('top');
      } else {
        setCalendarPosition('bottom');
      }
    } else {
      // 기본값 설정
      setCalendarPosition('bottom');
    }
  };

  // 달력 열기/닫기
  const toggleCalendar = () => {
    if (!showCalendar) {
      // 달력이 열릴 때 위치 계산
      setTimeout(() => {
        calculateCalendarPosition();
      }, 0);
    }
    setShowCalendar(!showCalendar);
  };

  // 달력에서 날짜 선택
  const handleCalendarDateSelect = (day) => {
    const month = (currentCalendarDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentCalendarDate.getFullYear().toString();
    const dayStr = day.toString().padStart(2, '0');
    
    // formData를 직접 업데이트하여 즉시 반영
    setFormData(prev => {
      const newData = {
        ...prev,
        birthMonth: month,
        birthDay: dayStr,
        birthYear: year
      };
      return newData;
    });
    
    // 선택된 날짜로 달력 날짜도 업데이트
    const selectedDate = new Date(parseInt(year), parseInt(month) - 1, day);
    setCurrentCalendarDate(selectedDate);
    
    setShowCalendar(false);
  };

  // 달력 월 변경
  const changeCalendarMonth = (direction) => {
    setCurrentCalendarDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };


  // 외부 클릭 시 드롭다운과 달력 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showGenderDropdown && !event.target.closest('.signup-select-container')) {
        setShowGenderDropdown(false);
      }
      if (showCalendar && !event.target.closest('.signup-date-container')) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGenderDropdown, showCalendar]);

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Header */}
        <div className="signup-header">
          <div className="signup-logo-container">
            <div className="signup-logo">
              <img src={moonIcon} alt="moon icon" />
            </div>
            <h1 className="signup-title">mong</h1>
          </div>

          <div>
            <h4 className="signup-subtitle">회원가입</h4>
            <p className="signup-description">
              mong과 함께 완벽한 수면 여행을 시작하세요
            </p>
          </div>

          {/* Stepper */}
          <div className="signup-stepper">
            {/* 이메일 */}
            <div className={`stepper-step ${currentStep >= 1 ? (emailValid ? 'completed' : 'current') : ''}`}>
              <div className="stepper-step-icon">
                {emailValid ? (
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
                    <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                    <path d="m9 11 3 3L22 4"></path>
                  </svg>
                ) : (
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
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                )}
              </div>
              <span className="stepper-step-label">이메일</span>
            </div>
            <div className="stepper-connector" />
            {/* 인증 */}
            <div className={`stepper-step ${currentStep >= 2 ? (verificationValid ? 'completed' : 'current') : ''}`}>
              <div className="stepper-step-icon">
                {verificationValid ? (
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
                    <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                    <path d="m9 11 3 3L22 4"></path>
                  </svg>
                ) : (
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
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                )}
              </div>
              <span className="stepper-step-label">인증</span>
            </div>
            <div className="stepper-connector" />
            {/* 정보 */}
            <div className={`stepper-step ${currentStep >= 3 ? 'current' : ''}`}>
              <div className="stepper-step-icon">
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
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className="stepper-step-label">정보</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="signup-content">
          {/* 1단계: 이메일 입력 */}
          {currentStep === 1 && (
            <form className="signup-form" onSubmit={handleEmailSubmit}>
              <div className="signup-field">
                <label className="signup-label" htmlFor="email">
                  이메일
                </label>
                <div className="signup-input-group">
                  <input
                    type="email"
                    className="signup-input"
                    id="email"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="signup-verify-button"
                    disabled={!formData.email}
                  >
                    인증번호 받기
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* 2단계: 인증번호 입력 */}
          {currentStep === 2 && (
            <form className="signup-form" onSubmit={handleVerificationSubmit}>
              <div className="signup-field">
                <label className="signup-label" htmlFor="email">
                  이메일
                </label>
                <div className="signup-input-group">
                  <input
                    type="email"
                    className="signup-input signup-input-with-status"
                    id="email"
                    value={formData.email}
                    disabled
                    readOnly
                  />
                  <div className="signup-status-indicator">
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
                      <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                  </div>
                </div>
                <p className="signup-status-message">
                  {formData.email}로 인증번호를 전송했습니다. 이메일을 확인해주세요.
                </p>
              </div>

              <div className="signup-field">
                <label className="signup-label" htmlFor="verification">
                  인증번호 (6자리)
                </label>
                <div className="signup-input-group">
                  <input
                    type="text"
                    className="signup-verification-input"
                    id="verification"
                    placeholder="000000"
                    maxLength={6}
                    value={formData.verificationCode}
                    onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="signup-resend-button"
                    onClick={handleResendClick}
                  >
                    재전송
                  </button>
                  <button
                    type="submit"
                    className="signup-verify-button"
                    disabled={formData.verificationCode.length !== 6}
                  >
                    인증하기
                  </button>
                </div>
                {showResendMessage && (
                  <div className="signup-resend-message">
                    인증번호를 다시 전송했습니다.
                  </div>
                )}
              </div>
            </form>
          )}

          {/* 3단계: 모든 정보 입력 */}
          {currentStep === 3 && (
            <form className="signup-form" onSubmit={onSubmit}>
              {/* 이메일 (읽기 전용) */}
              <div className="signup-field">
                <label className="signup-label" htmlFor="email">
                  이메일
                </label>
                <div className="signup-input-group">
                  <input
                    type="email"
                    className="signup-input signup-input-with-status"
                    id="email"
                    value={formData.email}
                    disabled
                    readOnly
                  />
                  <div className="signup-status-indicator">
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
                      <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                  </div>
                </div>
                <p className="signup-status-message">이메일 인증이 완료되었습니다</p>
              </div>

              {/* 인증번호 (읽기 전용) */}
              <div className="signup-field">
                <label className="signup-label" htmlFor="verification">
                  인증번호 (6자리)
                </label>
                <div className="signup-input-group">
                  <input
                    type="text"
                    className="signup-verification-input signup-input-with-status"
                    id="verification"
                    value={formData.verificationCode}
                    disabled
                    readOnly
                  />
                  <div className="signup-status-indicator">
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
                      <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                  </div>
                </div>
                <p className="signup-status-message">이메일 인증이 완료되었습니다</p>
              </div>

              {/* 이름 */}
              <div className="signup-field">
                <label className="signup-label" htmlFor="name">
                  이름
                </label>
                <input
                  type="text"
                  className="signup-input"
                  id="name"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
                <p className="signup-helper-text">
                  서비스에서 사용할 이름입니다
                </p>
              </div>

              {/* 생년월일/성별 */}
              <div className="signup-grid">
                <div className="signup-field">
                  <label className="signup-label" htmlFor="birthDate">
                    생년월일
                  </label>
                  <div className="signup-date-container">
                    <input
                      type="text"
                      className="signup-date-input"
                      placeholder="MM"
                      maxLength="2"
                      value={formData.birthMonth || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 숫자만 허용하고 2자리 제한
                        const numericValue = value.replace(/[^0-9]/g, '');
                        if (numericValue === '' || (parseInt(numericValue) >= 1 && parseInt(numericValue) <= 12)) {
                          handleInputChange('birthMonth', numericValue);
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value && parseInt(value) < 10) {
                          handleInputChange('birthMonth', value.padStart(2, '0'));
                        }
                      }}
                      required
                    />
                    <span className="signup-date-separator">/</span>
                    <input
                      type="text"
                      className="signup-date-input"
                      placeholder="DD"
                      maxLength="2"
                      value={formData.birthDay || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 숫자만 허용하고 2자리 제한
                        const numericValue = value.replace(/[^0-9]/g, '');
                        if (numericValue === '' || (parseInt(numericValue) >= 1 && parseInt(numericValue) <= 31)) {
                          handleInputChange('birthDay', numericValue);
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (value && parseInt(value) < 10) {
                          handleInputChange('birthDay', value.padStart(2, '0'));
                        }
                      }}
                      required
                    />
                    <span className="signup-date-separator">/</span>
                    <input
                      type="text"
                      className="signup-date-input"
                      placeholder="YYYY"
                      maxLength="4"
                      value={formData.birthYear || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // 숫자만 허용하고 4자리 제한
                        const numericValue = value.replace(/[^0-9]/g, '');
                        
                        // 4자리까지만 입력 허용
                        if (numericValue.length <= 4) {
                          handleInputChange('birthYear', numericValue);
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        // 4자리 연도가 유효한 범위인지 확인
                        if (value && value.length === 4) {
                          const year = parseInt(value);
                          if (year >= 1900 && year <= 2024) {
                            handleInputChange('birthYear', value);
                          } else {
                            // 유효하지 않은 연도면 빈 값으로 초기화
                            handleInputChange('birthYear', '');
                          }
                        } else if (value && value.length < 4) {
                          // 4자리 미만이면 빈 값으로 초기화
                          handleInputChange('birthYear', '');
                        }
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="signup-calendar-button"
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
                  {showCalendar && (
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
                          {currentCalendarDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
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
                          const year = currentCalendarDate.getFullYear();
                          const month = currentCalendarDate.getMonth();
                          const firstDay = new Date(year, month, 1);
                          const lastDay = new Date(year, month + 1, 0);
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
                              formData.birthMonth && formData.birthDay && formData.birthYear &&
                              formData.birthMonth === (month + 1).toString().padStart(2, '0') &&
                              formData.birthDay === day.toString().padStart(2, '0') &&
                              formData.birthYear === year.toString();
                            
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
                </div>

                <div className="signup-field">
                  <label className="signup-label" htmlFor="gender">
                    성별
                  </label>
                  <div className="signup-select-container">
                    <button
                      type="button"
                      className="signup-select-trigger"
                      onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                    >
                      <span>{formData.gender || "성별을 선택하세요"}</span>
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
                    {showGenderDropdown && (
                      <div className="signup-dropdown-menu">
                        <button
                          type="button"
                          className="signup-dropdown-item"
                          onClick={() => {
                            handleInputChange('gender', '남');
                            setShowGenderDropdown(false);
                          }}
                        >
                          남자
                        </button>
                        <button
                          type="button"
                          className="signup-dropdown-item"
                          onClick={() => {
                            handleInputChange('gender', '여');
                            setShowGenderDropdown(false);
                          }}
                        >
                          여자
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 비밀번호 / 확인 */}
              <div className="signup-grid">
                {/* 비밀번호 */}
                <div className="signup-field">
                  <label className="signup-label" htmlFor="password">
                    비밀번호
                  </label>
                  <div className="signup-password-container">
                    <input
                      type={showPw ? "text" : "password"}
                      className="signup-password-input"
                      id="password"
                      placeholder="비밀번호 (8자 이상)"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                    <button
                      className="signup-password-toggle"
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
                    >
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
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    </button>
                  </div>
                </div>

                {/* 비밀번호 확인 */}
                <div className="signup-field">
                  <label className="signup-label" htmlFor="confirmPassword">
                    비밀번호 확인
                  </label>
                  <div className="signup-password-container">
                    <input
                      type={showPw2 ? "text" : "password"}
                      className="signup-password-input"
                      id="confirmPassword"
                      placeholder="비밀번호 다시 입력"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required
                    />
                    <button
                      className="signup-password-toggle"
                      type="button"
                      onClick={() => setShowPw2((v) => !v)}
                      aria-label={showPw2 ? "비밀번호 숨기기" : "비밀번호 보기"}
                    >
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
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* 제출 */}
              <button className="signup-button" type="submit">
                mong과 함께 시작하기
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="signup-footer">
            <p>
              이미 계정이 있으신가요?{" "}
              <button 
                type="button"
                onClick={() => navigate('/login')}
                className="signup-login-link"
              >
                로그인
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}