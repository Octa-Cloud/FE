// ForgotPassword.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/hooks";
import AuthHeader from "../components/AuthHeader";
import FormField from "../components/FormField";
import AuthButton from "../components/AuthButton";
import moonIcon from "../assets/moonIcon.svg";
import "../styles/login.css";
import "../styles/common.css";
import { User } from "../types";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const navigate = useNavigate();
  // useAuth는 더 이상 필요하지 않음

  // testCredentials는 더 이상 사용하지 않음 (다중 계정 시스템으로 변경)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 입력값 검증
    if (!email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }
    
    // 등록된 사용자 목록에서 이메일 확인
    const existingUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.find(user => user.email === email.trim());
    
    if (!userExists) {
      alert('등록되지 않은 이메일입니다. 올바른 이메일을 입력해주세요.');
      return;
    }
    
    // TODO: 비밀번호 재설정 요청 연결 (API 연동)
    console.log({ email });
    // 이메일 발송 완료 상태로 변경
    setIsEmailSent(true);
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="login-card w-full max-w-md glass rounded-2xl shadow-xl p-8">
        {/* Header */}
        <AuthHeader 
          title="로그인"
          description="계정에 로그인하여 수면 여행을 계속하세요"
        />

        {/* Content */}
        <div className="login-content mt-8">
          {!isEmailSent ? (
            <form className="login-form space-y-6" onSubmit={onSubmit}>
              <div className="forgot-password-title text-center mb-6">
                <h3 className="forgot-password-heading text-2xl font-bold text-gray-800 mb-2">비밀번호 찾기</h3>
                <p className="forgot-password-description text-gray-600">
                  가입할 때 사용한 이메일 주소를 입력해주세요
                </p>
              </div>

              {/* 이메일 */}
              <FormField
                label="이메일"
                id="forgot-email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              {/* 버튼들 */}
              <div className="forgot-password-buttons space-y-3">
                <AuthButton type="submit">
                  비밀번호 재설정 링크 받기
                </AuthButton>
                <AuthButton
                  type="button"
                  variant="secondary"
                  onClick={handleBackToLogin}
                >
                  로그인으로 돌아가기
                </AuthButton>
              </div>
            </form>
          ) : (
            <div className="email-sent-container text-center space-y-6">
              <div className="email-sent-icon flex justify-center">
                <img src={moonIcon} alt="moon icon" className="w-16 h-16 animate-float" />
              </div>
              <div className="email-sent-content space-y-4">
                <h3 className="email-sent-title text-2xl font-bold text-gray-800">이메일 발송 완료</h3>
                <p className="email-sent-description text-gray-600">
                  <strong className="text-primary-600">{email}</strong>로 비밀번호 재설정 링크를 보내드렸습니다.
                </p>
                <p className="email-sent-note text-sm text-gray-500">
                  이메일이 보이지 않는다면 스팸 폴더를 확인해주세요.
                </p>
              </div>
              <div className="email-sent-button">
                <button 
                  type="button" 
                  className="email-sent-link text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  onClick={handleBackToLogin}
                >
                  로그인으로 돌아가기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
