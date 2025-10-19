// Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/hooks";
import { loginUser } from "../store/slices/authSlice";
import { authAPI } from "../api/auth";
import AuthHeader from "../components/AuthHeader";
import BaseInput from "../components/BaseInput";
import PasswordInput from "../components/PasswordInput";
import AuthButton from "../components/AuthButton";
import AuthFooter from "../components/AuthFooter";
import Container from "../components/Container";
import "../styles/login.css";
import "../styles/common.css";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  // testCredentials는 더 이상 사용하지 않음 (다중 계정 시스템으로 변경)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // 입력값 검증
    if (!email.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }
    
    if (!pw.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    
    try {
      // API를 통한 로그인 시도
      const response = await authAPI.login({
        email: email.trim(),
        password: pw
      });
      
      if (response.code === 'COMMON200' && response.result) {
        // 토큰 저장
        localStorage.setItem('accessToken', response.result.accessToken);
        localStorage.setItem('refreshToken', response.result.refreshToken);
        
        // 기본 사용자 정보 저장
        const userInfo = {
          email: email.trim(),
          name: '사용자'
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        // Redux store 업데이트
        const result = await login({ email: email.trim(), password: pw });
        
        if (loginUser.fulfilled.match(result)) {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // 에러 메시지 처리
      let errorMessage = '로그인에 실패했습니다.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // 보안을 위해 일반적인 메시지만 표시
      if (errorMessage.includes('이메일 또는 비밀번호가 일치하지 않습니다') || 
          errorMessage.includes('등록된 사용자가 없습니다')) {
        errorMessage = '이메일 또는 비밀번호가 일치하지 않습니다.';
      }
      
      alert(errorMessage);
      
      // 로그인 실패 시 비밀번호 필드 초기화
      setPw('');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <Container centered backgroundColor="#000000">
      <div className="login-card">
        {/* Header */}
        <AuthHeader 
          title="로그인"
          description="계정에 로그인하여 수면 여행을 계속하세요"
        />

        {/* Content */}
        <div className="flex flex-col">
          <form className="flex flex-col gap-5 mt-[54px]" onSubmit={onSubmit}>
            {/* 이메일 */}
            <BaseInput
              label="이메일"
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            {/* 비밀번호 */}
            <PasswordInput
              label="비밀번호"
              id="password"
              placeholder="비밀번호를 입력하세요"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete="current-password"
              required
            />

            {/* 로그인 버튼 */}
            <AuthButton
              type="submit"
              disabled={loading}
              variant="primary"
            >
              {loading ? '로그인 중...' : '로그인'}
            </AuthButton>

            {/* 비밀번호 찾기 링크 */}
            <div className="text-center">
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="login-forgot-password-btn"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="login-error-message">
                {error}
              </div>
            )}
          </form>

          {/* Footer */}
          <AuthFooter 
            text="아직 계정이 없으신가요?"
            linkText="회원가입"
            onLinkClick={handleSignUp}
          />
        </div>
      </div>
    </Container>
  );
}
