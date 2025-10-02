// SignupCard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/hooks";
import AuthHeader from "../components/AuthHeader";
import FormField from "../components/FormField";
import ShortFormField from "../components/ShortFormField";
import AuthButton from "../components/AuthButton";
import AuthFooter from "../components/AuthFooter";
import CheckIcon from "../assets/checkIcon.svg";
import "../styles/signup.css";
import "../styles/common.css";

export default function SignupCard() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  
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
  const onSubmit = async (e) => {
    e.preventDefault();
    
    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        birthDate: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
        gender: formData.gender,
      };

      await register(userData);
      
      // 회원가입 성공 시 프로필 페이지로 이동
      navigate('/profile');
    } catch (error) {
      console.error('Registration failed:', error);
    }
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

  // Stepper 데이터 정의
  const stepperSteps = [
    {
      label: "이메일",
      completed: emailValid,
      icon: emailValid ? (
        <img src={CheckIcon} alt="" width="24" height="24" />
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
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      )
    },
    {
      label: "인증",
      completed: verificationValid,
      icon: verificationValid ? (
        <img src={CheckIcon} alt="" width="24" height="24" />
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
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <circle cx="12" cy="16" r="1"></circle>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      )
    },
    {
      label: "정보",
      completed: false,
      icon: (
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
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    }
  ];

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Header */}
        <AuthHeader 
          title="회원가입"
          description="mong과 함께 완벽한 수면 여행을 시작하세요"
          showStepper={true}
          currentStep={currentStep}
          steps={stepperSteps}
        />

        {/* Content */}
        <div className="signup-content">
          {/* 1단계: 이메일 입력 */}
          {currentStep === 1 && (
            <form className="signup-form" onSubmit={handleEmailSubmit}>
              <FormField
                label="이메일"
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="signup-field"
                buttons={
                  <AuthButton
                    type="submit"
                    className="signup-verify-button"
                    disabled={!formData.email}
                  >
                    인증번호 받기
                  </AuthButton>
                }
              />
            </form>
          )}

          {/* 2단계: 인증번호 입력 */}
          {currentStep === 2 && (
            <form className="signup-form" onSubmit={handleVerificationSubmit}>
              {/* 이메일 상태 표시 */}
              <FormField
                label="이메일"
                id="email"
                type="email"
                value={formData.email}
                disabled={true}
                readOnly={true}
                className="signup-field"
                helperText={`${formData.email}로 인증번호를 전송했습니다. 이메일을 확인해주세요.`}
                showStatusIndicator={true}
              />

              {/* 인증번호 입력 */}
              <FormField
                label="인증번호 (6자리)"
                id="verification"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={formData.verificationCode}
                onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                required
                className="signup-field"
                helperText={showResendMessage ? "인증번호를 다시 전송했습니다." : undefined}
                buttons={
                  <>
                    <AuthButton
                      type="button"
                      variant="secondary"
                      className="signup-resend-button"
                      onClick={handleResendClick}
                    >
                      재전송
                    </AuthButton>
                    <AuthButton
                      type="submit"
                      className="signup-verify-button"
                      disabled={formData.verificationCode.length !== 6}
                    >
                      인증하기
                    </AuthButton>
                  </>
                }
              />
            </form>
          )}

          {/* 3단계: 모든 정보 입력 */}
          {currentStep === 3 && (
            <form className="signup-form" onSubmit={onSubmit}>
              {/* 이메일 (읽기 전용) */}
              <FormField
                label="이메일"
                id="email"
                type="email"
                value={formData.email}
                disabled={true}
                readOnly={true}
                className="signup-field"
                helperText="이메일 인증이 완료되었습니다"
                showStatusIndicator={true}
              />

              {/* 인증번호 (읽기 전용) */}
              <FormField
                label="인증번호 (6자리)"
                id="verification"
                type="text"
                value={formData.verificationCode}
                disabled={true}
                readOnly={true}
                className="signup-field"
                helperText="이메일 인증이 완료되었습니다"
                showStatusIndicator={true}
              />

              {/* 이름 */}
              <FormField
                label="이름"
                id="name"
                type="text"
                placeholder="이름을 입력하세요"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                className="signup-field"
                helperText="서비스에서 사용할 이름입니다"
              />

              {/* 생년월일/성별 */}
              <div className="signup-grid">
                <ShortFormField
                  label="생년월일"
                  id="birthDate"
                  type="text"
                  placeholder="MM/DD/YYYY"
                  value={{
                    month: formData.birthMonth || '',
                    day: formData.birthDay || '',
                    year: formData.birthYear || ''
                  }}
                  onChange={(e) => {
                    if (e.target.value.month !== undefined) {
                      handleInputChange('birthMonth', e.target.value.month);
                    }
                    if (e.target.value.day !== undefined) {
                      handleInputChange('birthDay', e.target.value.day);
                    }
                    if (e.target.value.year !== undefined) {
                      handleInputChange('birthYear', e.target.value.year);
                    }
                  }}
                  required
                  className="signup-field"
                  showCalendar={true}
                  calendarPosition={calendarPosition}
                />

                <ShortFormField
                  label="성별"
                  id="gender"
                  type="text"
                  placeholder="성별을 선택하세요"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  required
                  className="signup-field"
                  options={[
                    { label: '남자', value: '남' },
                    { label: '여자', value: '여' }
                  ]}
                />
              </div>

              {/* 비밀번호 / 확인 */}
              <div className="signup-grid">
                <ShortFormField
                  label="비밀번호"
                  id="password"
                  type="password"
                  placeholder="비밀번호 (8자 이상)"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="signup-field"
                  showPasswordToggle={true}
                />

                <ShortFormField
                  label="비밀번호 확인"
                  id="confirmPassword"
                  type="password"
                  placeholder="비밀번호 다시 입력"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  className="signup-field"
                  showPasswordToggle={true}
                />
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="error-message" style={{ color: '#ef4444', marginBottom: '1rem' }}>
                  {error}
                </div>
              )}

              {/* 제출 */}
              <AuthButton 
                type="submit" 
                className="signup-button"
                disabled={loading}
              >
                {loading ? '가입 중...' : 'mong과 함께 시작하기'}
              </AuthButton>
            </form>
          )}

          {/* Footer */}
          <AuthFooter
            text="이미 계정이 있으신가요?"
            linkText="로그인"
            onLinkClick={() => navigate('/login')}
            className="signup-footer"
          />
        </div>
      </div>
    </div>
  );
}