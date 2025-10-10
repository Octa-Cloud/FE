// ForgotPassword.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/hooks";
import AuthHeader from "../components/AuthHeader";
import BaseInput from "../components/BaseInput";
import AuthButton from "../components/AuthButton";
import Container from "../components/Container";
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
    <Container centered backgroundColor="#000000">
      <div className="login-card">
        {/* Header */}
        <AuthHeader 
          title="비밀번호 재설정"
          description="이메일로 비밀번호 재설정 링크를 받아보세요"
        />

        {/* Content */}
        <div className="flex flex-col">
          {!isEmailSent ? (
            <form className="flex flex-col gap-5 mt-[54px]" onSubmit={onSubmit}>

              {/* 이메일 */}
              <BaseInput
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
              <div className="forgot-password-buttons">
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
            <div className="flex flex-col items-center text-center py-10">
              <div className="w-16 h-16 rounded-full bg-[rgba(0,212,170,0.1)] flex items-center justify-center mb-6">
                <img src={moonIcon} alt="moon icon" className="w-8 h-8" />
              </div>
              <div className="mb-8">
                <h3 className="email-sent-title">이메일 발송 완료</h3>
                <p className="email-sent-description">
                  <strong>{email}</strong>로 비밀번호 재설정 링크를 보내드렸습니다.
                </p>
                <p className="email-sent-note">
                  이메일이 보이지 않는다면 스팸 폴더를 확인해주세요.
                </p>
              </div>
              <div className="w-full">
                <button 
                  type="button" 
                  className="auth-button"
                  onClick={handleBackToLogin}
                >
                  로그인으로 돌아가기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
