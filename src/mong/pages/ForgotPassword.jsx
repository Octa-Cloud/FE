// ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import FormField from "../components/FormField";
import AuthButton from "../components/AuthButton";
import "../styles/login.css";
import "../styles/common.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: 비밀번호 재설정 요청 연결 (API 연동)
    console.log({ email });
    // 이메일 발송 완료 상태로 변경
    setIsEmailSent(true);
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <AuthHeader 
          title="로그인"
          description="계정에 로그인하여 수면 여행을 계속하세요"
        />

        {/* Content */}
        <div className="login-content">
          {!isEmailSent ? (
            <form className="login-form" onSubmit={onSubmit}>
              <div className="forgot-password-title">
                <h3 className="forgot-password-heading">비밀번호 찾기</h3>
                <p className="forgot-password-description">
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
            <div className="email-sent-container">
              <div className="email-sent-icon">
                <img src={moonIcon} alt="moon icon" />
              </div>
              <div className="email-sent-content">
                <h3 className="email-sent-title">이메일 발송 완료</h3>
                <p className="email-sent-description">
                  <strong>{email}</strong>로 비밀번호 재설정 링크를 보내드렸습니다.
                </p>
                <p className="email-sent-note">
                  이메일이 보이지 않는다면 스팸 폴더를 확인해주세요.
                </p>
              </div>
              <AuthButton onClick={handleBackToLogin}>
                로그인으로 돌아가기
              </AuthButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
