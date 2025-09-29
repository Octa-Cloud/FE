// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthHeader from "../components/AuthHeader";
import FormField from "../components/FormField";
import AuthButton from "../components/AuthButton";
import AuthFooter from "../components/AuthFooter";
import "../styles/login.css";
import "../styles/common.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: 로그인 요청 연결 (API 연동)
    console.log({ email, password: pw });
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
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
          <form className="login-form" onSubmit={onSubmit}>
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
            <AuthButton type="submit">
              로그인
            </AuthButton>

            {/* 비밀번호 찾기 */}
            <div className="login-forgot-password">
              <button type="button" onClick={handleForgotPassword}>
                비밀번호를 잊으셨나요?
              </button>
            </div>
          </form>

          {/* Footer */}
          <AuthFooter
            text="아직 계정이 없으신가요?"
            linkText="회원가입"
            onLinkClick={() => navigate("/signup")}
          />
        </div>
      </div>
    </div>
  );
}
