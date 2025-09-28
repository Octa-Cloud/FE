// SignupCard.jsx
import React, { useState } from "react";
import "../styles/signup.css";

export default function SignupCard() {
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: 제출 로직 연결
    console.log("submit");
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Header */}
        <div className="signup-header">
          <div className="signup-logo-container">
            <div className="signup-logo">
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
                <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"></path>
              </svg>
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
            <div className="stepper-step completed">
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
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
              </div>
              <span className="stepper-step-label">이메일</span>
            </div>
            <div className="stepper-connector" />
            {/* 인증 */}
            <div className="stepper-step completed">
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
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
              </div>
              <span className="stepper-step-label">인증</span>
            </div>
            <div className="stepper-connector" />
            {/* 정보 */}
            <div className="stepper-step current">
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
          <form className="signup-form" onSubmit={onSubmit}>
            {/* 이메일 */}
            <div className="signup-field">
              <label className="signup-label" htmlFor="email">
                이메일
              </label>
              <div className="signup-input-group">
                <input
                  type="email"
                  className="signup-input signup-input-with-status"
                  id="email"
                  placeholder="이메일을 입력하세요"
                  defaultValue="aaaa@gmail.com"
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
                aaaa@gmail.com로 인증번호를 전송했습니다
              </p>
            </div>

            {/* 인증번호 */}
            <div className="signup-field">
              <label className="signup-label" htmlFor="verification">
                인증번호 (6자리)
              </label>
              <div className="signup-input-group">
                <input
                  type="text"
                  className="signup-verification-input signup-input-with-status"
                  id="verification"
                  placeholder="000000"
                  maxLength={6}
                  defaultValue="123456"
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
                <input
                  type="date"
                  className="signup-date-input"
                  id="birthDate"
                />
              </div>

              <div className="signup-field">
                <label className="signup-label" htmlFor="gender">
                  성별
                </label>
                <div className="signup-select-container">
                  <button
                    type="button"
                    role="combobox"
                    aria-expanded="false"
                    aria-autocomplete="none"
                    className="signup-select-trigger"
                  >
                    <span>성별을 선택하세요</span>
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
                  <select
                    aria-hidden="true"
                    tabIndex={-1}
                    className="signup-select-hidden"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      성별을 선택하세요
                    </option>
                    <option value="남">남</option>
                    <option value="여">여</option>
                  </select>
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

          {/* Footer */}
          <div className="signup-footer">
            <p>
              이미 계정이 있으신가요?{" "}
              <button type="button">
                로그인
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}