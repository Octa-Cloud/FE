// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import moonIcon from "../assets/moonIcon.svg";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
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
        <div className="login-header">
          <div className="login-logo-container">
            <div className="login-logo">
              <img src={moonIcon} alt="moon icon" />
            </div>
            <h1 className="login-title">mong</h1>
          </div>

          <div>
            <h4 className="login-subtitle">로그인</h4>
            <p className="login-description">
              계정에 로그인하여 수면 여행을 계속하세요
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="login-content">
          <form className="login-form" onSubmit={onSubmit}>
            {/* 이메일 */}
            <div className="login-field">
              <label className="login-label" htmlFor="email">
                이메일
              </label>
              <input
                type="email"
                className="login-input"
                id="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* 비밀번호 */}
            <div className="login-field">
              <label className="login-label" htmlFor="password">
                비밀번호
              </label>
              <div className="login-password-container">
                <input
                  type={showPw ? "text" : "password"}
                  className="login-password-input"
                  id="password"
                  placeholder="비밀번호를 입력하세요"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  className="login-password-toggle"
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

            {/* 로그인 버튼 */}
            <button className="login-button" type="submit">
              로그인
            </button>

            {/* 비밀번호 찾기 */}
            <div className="login-forgot-password">
              <button type="button" onClick={handleForgotPassword}>
                비밀번호를 잊으셨나요?
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p>
              아직 계정이 없으신가요?{" "}
              <button
              type="button"
              onClick={() => navigate("/signup")}
              >
                회원가입
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
