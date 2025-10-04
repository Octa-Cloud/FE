// Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/hooks";
import { loginUser } from "../store/slices/authSlice";
import AuthHeader from "../components/AuthHeader";
import FormField from "../components/FormField";
import AuthButton from "../components/AuthButton";
import AuthFooter from "../components/AuthFooter";
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
    
    // 로그인 시도
    const result = await login({ email: email.trim(), password: pw });
    
    // 로그인 성공 시에만 프로필 페이지로 이동
    if (loginUser.fulfilled.match(result)) {
      navigate('/profile');
    } else if (loginUser.rejected.match(result)) {
      // 로그인 실패 시 사용자 친화적인 alert 메시지 표시
      const errorMessage = result.payload || '로그인에 실패했습니다.';
      
      // 보안을 위해 일반적인 메시지만 표시
      let userMessage = errorMessage;
      if (errorMessage.includes('이메일 또는 비밀번호가 일치하지 않습니다') || errorMessage.includes('등록된 사용자가 없습니다')) {
        userMessage = '이메일 또는 비밀번호가 일치하지 않습니다.';
      } else if (errorMessage.includes('로그인 시도 횟수가 너무 많습니다')) {
        userMessage = errorMessage; // 시도 횟수 제한 메시지는 그대로 표시
      }
      
      alert(userMessage);
      
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
    <div className="login-container min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="login-card w-full max-w-md glass rounded-2xl shadow-xl p-8">
        {/* Header */}
        <AuthHeader 
          title="로그인"
          description="계정에 로그인하여 수면 여행을 계속하세요"
        />

        {/* Content */}
        <div className="login-content mt-8">
          <form className="login-form space-y-6" onSubmit={onSubmit}>
            {/* 이메일 */}
            <FormField
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
            <FormField
              label="비밀번호"
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              autoComplete="current-password"
              required
            />

            {/* 로그인 버튼 */}
            <AuthButton type="submit" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </AuthButton>

            {/* 비밀번호 찾기 링크 */}
            <div className="forgot-password-link text-center">
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="error-message text-center p-4 text-error-600 bg-error-50 border border-error-200 rounded-lg mb-4">
                {error}
              </div>
            )}
          </form>

          {/* Footer */}
          <AuthFooter 
            text="계정이 없으신가요?"
            linkText="회원가입"
            onLinkClick={handleSignUp}
            className="mt-6"
          />
        </div>
      </div>
    </div>
  );
}
