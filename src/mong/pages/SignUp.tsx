// SignupCard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/hooks";
import { authAPI, SignUpRequest } from "../api/auth";
import AuthHeader from "../components/AuthHeader";
import BaseInput from "../components/BaseInput";
import InputWithButtons from "../components/InputWithButtons";
import VerifiedInput from "../components/VerifiedInput";
import PasswordInput from "../components/PasswordInput";
import SelectInput from "../components/SelectInput";
import AuthButton from "../components/AuthButton";
import AuthFooter from "../components/AuthFooter";
import Container from "../components/Container";
import CheckIcon from "../assets/checkIcon.svg";
import "../styles/signup.css";
import "../styles/common.css";
import { FormData, PasswordValidation, User } from "../types";

export default function SignupCard() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  
  // 단계 관리
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // 폼 데이터
  const [formData, setFormData] = useState<FormData>({
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
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [verificationSent, setVerificationSent] = useState<boolean>(false);
  const [verificationValid, setVerificationValid] = useState<boolean>(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState<boolean>(false);
  const [showResendMessage, setShowResendMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 이메일 포맷 검증
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 비밀번호 검증 함수
  const validatePassword = (password: string): PasswordValidation => {
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    return {
      isValid: hasLowerCase && hasNumber && hasSpecialChar,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    };
  };

  // 이메일 입력 처리
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateEmail(formData.email)) {
      try {
        console.log('🚀 이메일 인증 요청 시작:', formData.email);
        // 이메일 인증 요청 API 호출
        const response = await authAPI.sendVerificationEmail(formData.email);
        console.log('✅ 이메일 인증 요청 성공:', response);
        setEmailValid(true);
        setVerificationSent(true);
        setCurrentStep(2);
        setErrorMessage('');
      } catch (error: any) {
        console.error('❌ 이메일 인증 요청 실패:', error);
        console.error('❌ 에러 응답:', error.response?.data);
        setErrorMessage(error.response?.data?.message || '이메일 인증 요청에 실패했습니다.');
      }
    }
  };

  // 인증번호 입력 처리
  const handleVerificationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.verificationCode.length === 6) {
      try {
        console.log('🔐 이메일 인증 코드 검증 시작:', {
          email: formData.email,
          code: formData.verificationCode
        });
        // 이메일 인증 코드 검증 API 호출
        const response = await authAPI.verifyEmail(formData.email, formData.verificationCode);
        console.log('✅ 이메일 인증 코드 검증 성공:', response);
        setVerificationValid(true);
        setCurrentStep(3);
        setErrorMessage('');
      } catch (error: any) {
        console.error('❌ 이메일 인증 코드 검증 실패:', error);
        console.error('❌ 에러 응답:', error.response?.data);
        setErrorMessage(error.response?.data?.message || '인증 코드가 올바르지 않습니다.');
      }
    }
  };

  // 재전송 버튼 클릭
  const handleResendClick = async () => {
    try {
      console.log('🔄 이메일 재전송 시작:', formData.email);
      const response = await authAPI.sendVerificationEmail(formData.email);
      console.log('✅ 이메일 재전송 성공:', response);
      setShowResendMessage(true);
      setErrorMessage('');
    } catch (error: any) {
      console.error('❌ 이메일 재전송 실패:', error);
      console.error('❌ 에러 응답:', error.response?.data);
      setErrorMessage(error.response?.data?.message || '이메일 재전송에 실패했습니다.');
    }
  };

  // 중복 검증 함수
  const checkDuplicateCredentials = (email: string, password: string) => {
    const existingUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const duplicateEmail = existingUsers.find(user => user.email === email);
    const duplicatePassword = existingUsers.find(user => user.password === password);
    
    return { duplicateEmail, duplicatePassword };
  };

  // 필수 필드 검증 함수
  const validateRequiredFields = (): boolean => {
    // 우선순위: 이메일 -> 이름 -> 생년월일 -> 성별 -> 비밀번호 -> 비밀번호 확인
    if (!formData.email.trim()) {
      setErrorMessage('이메일을 입력해주세요.');
      return false;
    }
    
    if (!formData.name.trim()) {
      setErrorMessage('이름을 입력해주세요.');
      return false;
    }
    
    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      setErrorMessage('생년월일을 입력해주세요.');
      return false;
    }
    
    if (!formData.gender) {
      setErrorMessage('성별을 선택해주세요.');
      return false;
    }
    
    if (!formData.password) {
      setErrorMessage('비밀번호를 입력해주세요.');
      return false;
    }
    
    if (!formData.confirmPassword) {
      setErrorMessage('비밀번호 확인을 입력해주세요.');
      return false;
    }
    
    return true;
  };

  // 최종 제출
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 필수 필드 검증
    if (!validateRequiredFields()) {
      return;
    }
    
    // 비밀번호 형식 검증
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      let missingRequirements: string[] = [];
      if (!passwordValidation.hasLowerCase) missingRequirements.push('소문자');
      if (!passwordValidation.hasNumber) missingRequirements.push('숫자');
      if (!passwordValidation.hasSpecialChar) missingRequirements.push('특수문자');
      
      alert(`비밀번호는 ${missingRequirements.join(', ')}를 포함해야 합니다.`);
      return;
    }
    
    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 중복 검증
    const { duplicateEmail, duplicatePassword } = checkDuplicateCredentials(formData.email, formData.password);
    
    if (duplicateEmail) {
      alert('이미 등록된 이메일입니다. 다른 이메일을 사용해주세요.');
      return;
    }
    
    if (duplicatePassword) {
      alert('이미 사용 중인 비밀번호입니다. 다른 비밀번호를 사용해주세요.');
      // 비밀번호와 비밀번호 확인을 모두 빈 값으로 초기화
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
      return;
    }

    try {
      // 에러 메시지 초기화
      setErrorMessage('');
      
      // 성별을 백엔드 형식으로 변환
      const genderMapping = {
        '남': 'MALE' as const,
        '여': 'FEMALE' as const
      };

      const signUpData: SignUpRequest = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        nickname: formData.name, // 현재는 이름을 닉네임으로 사용
        gender: genderMapping[formData.gender as '남' | '여']
      };

      console.log('🚀 회원가입 시작:', signUpData);
      await authAPI.signUp(signUpData);
      
      // 회원가입 성공 시 알림창 표시 후 대시보드로 이동
      alert('회원가입이 완료되었습니다! 반가워요!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('❌ 회원가입 실패:', error);
      console.error('❌ 에러 응답:', error.response?.data);
      
      // 에러 코드별 메시지 처리
      const errorCode = error.response?.data?.code;
      const errorMessage = error.response?.data?.message;
      
      if (errorCode === 'AUTH009') {
        setErrorMessage('이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.');
      } else if (errorCode === 'AUTH008') {
        setErrorMessage('이메일 인증이 완료되지 않았습니다. 이메일 인증을 먼저 진행해주세요.');
      } else {
        setErrorMessage(errorMessage || '회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 입력값 변경 처리
  const handleInputChange = (field: keyof FormData, value: string) => {
    // 입력값이 변경되면 에러 메시지 초기화
    if (errorMessage) {
      setErrorMessage('');
    }
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      
      return newData;
    });
  };

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showGenderDropdown && !(event.target as Element).closest('.signup-select-container')) {
        setShowGenderDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGenderDropdown]);

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
    <Container centered backgroundColor="#000000">
      <div className="signup-card">
        {/* Header */}
        <AuthHeader 
          title="회원가입"
          description="mong과 함께 완벽한 수면 여행을 시작하세요"
          showStepper={true}
          currentStep={currentStep}
          steps={stepperSteps}
        />

        {/* Error Message */}
        {errorMessage && (
          <div className="signup-error-message">
            {errorMessage}
          </div>
        )}

        {/* Content */}
        <div className="signup-content">
          {/* 1단계: 이메일 입력 */}
          {currentStep === 1 && (
            <form className="signup-form" onSubmit={handleEmailSubmit}>
              <InputWithButtons
                label="이메일"
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                buttons={
                  <AuthButton
                    type="submit"
className="h-12 px-6 bg-[#00d4aa] text-black text-base font-medium leading-6 border-none rounded-lg cursor-pointer transition-all duration-200 whitespace-nowrap min-w-[120px] flex items-center justify-center"
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
              <VerifiedInput
                label="이메일"
                id="email"
                type="email"
                value={formData.email}
                helperText={`${formData.email}로 인증번호를 전송했습니다.\n이메일을 확인해주세요.`}
              />

              {/* 인증번호 입력 */}
              <InputWithButtons
                label="인증번호 (6자리)"
                id="verification"
                type="text"
                placeholder="000000"
                maxLength={6}
                value={formData.verificationCode}
                onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                required
                helperText={showResendMessage ? "인증번호를 다시 전송했습니다." : undefined}
                buttons={
                  <>
                    <AuthButton
                      type="button"
                      variant="secondary"
className="h-12 px-6 bg-[#2a2a2a] text-white border border-[#2a2a2a] rounded-lg text-base font-medium leading-6 cursor-pointer transition-all duration-200 whitespace-nowrap min-w-[80px] flex items-center justify-center"
                      onClick={handleResendClick}
                    >
                      재전송
                    </AuthButton>
                    <AuthButton
                      type="submit"
  className="h-12 px-6 bg-[#00d4aa] text-black text-base font-medium leading-6 border-none rounded-lg cursor-pointer transition-all duration-200 whitespace-nowrap min-w-[120px] flex items-center justify-center"
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
              <VerifiedInput
                label="이메일"
                id="email"
                type="email"
                value={formData.email}
                helperText="이메일 인증이 완료되었습니다"
              />

              {/* 인증번호 (읽기 전용) */}
              <VerifiedInput
                label="인증번호 (6자리)"
                id="verification"
                type="text"
                value={formData.verificationCode}
                helperText="이메일 인증이 완료되었습니다"
              />

              {/* 이름 */}
              <BaseInput
                label="이름"
                id="name"
                type="text"
                placeholder="이름을 입력하세요"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                helperText="서비스에서 사용할 이름입니다"
              />

              {/* 생년월일/성별 */}
              <div className="grid grid-cols-2 gap-4 items-start w-full">
                <div className="form-field">
                  <label className="form-label" htmlFor="birthDate">
                    생년월일
                  </label>
                  <div className="flex items-center gap-2 w-full max-w-full overflow-hidden">
                    <input
                      type="text"
                      className="signup-date-input"
                      placeholder="MM"
                      maxLength={2}
                      value={formData.birthMonth || ''}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                        if (numericValue === '' || (parseInt(numericValue) >= 1 && parseInt(numericValue) <= 12)) {
                          handleInputChange('birthMonth', numericValue);
                        }
                      }}
                      onBlur={(e) => {
                        const val = e.target.value;
                        if (val && parseInt(val) < 10) {
                          handleInputChange('birthMonth', val.padStart(2, '0'));
                        }
                      }}
                      required
                    />
                    <span className="text-zinc-400 text-base font-medium">/</span>
                    <input
                      type="text"
                      className="signup-date-input"
                      placeholder="DD"
                      maxLength={2}
                      value={formData.birthDay || ''}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                        if (numericValue === '' || (parseInt(numericValue) >= 1 && parseInt(numericValue) <= 31)) {
                          handleInputChange('birthDay', numericValue);
                        }
                      }}
                      onBlur={(e) => {
                        const val = e.target.value;
                        if (val && parseInt(val) < 10) {
                          handleInputChange('birthDay', val.padStart(2, '0'));
                        }
                      }}
                      required
                    />
                    <span className="text-zinc-400 text-base font-medium">/</span>
                    <input
                      type="text"
                      className="signup-date-input signup-date-input-year"
                      placeholder="YYYY"
                      maxLength={4}
                      value={formData.birthYear || ''}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                        if (numericValue.length <= 4) {
                          handleInputChange('birthYear', numericValue);
                        }
                      }}
                      onBlur={(e) => {
                        const val = e.target.value;
                        if (val && val.length === 4) {
                          const year = parseInt(val);
                          if (year >= 1900 && year <= 2024) {
                            handleInputChange('birthYear', val);
                          } else {
                            handleInputChange('birthYear', '');
                          }
                        } else if (val && val.length < 4) {
                          handleInputChange('birthYear', '');
                        }
                      }}
                      required
                    />
                  </div>
                </div>

                <SelectInput
                  label="성별"
                  id="gender"
                  placeholder="성별을 선택하세요"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  required
                  options={[
                    { label: '남자', value: '남' },
                    { label: '여자', value: '여' }
                  ]}
                />
              </div>

              {/* 비밀번호 / 확인 */}
              <div className="grid grid-cols-2 gap-4 items-start">
                <PasswordInput
                  label="비밀번호"
                  id="password"
                  placeholder="비밀번호 (8자 이상)"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />

                <PasswordInput
                  label="비밀번호 확인"
                  id="confirmPassword"
                  placeholder="비밀번호 다시 입력"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                />
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="signup-error-message">
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
          />
        </div>
      </div>
    </Container>
  );
}
