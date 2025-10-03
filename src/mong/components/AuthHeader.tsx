import React from "react";
import moonIcon from "../assets/moonIcon.svg";
import { AuthHeaderProps } from "../types";

export default function AuthHeader({ title, description, showStepper, currentStep, steps }: AuthHeaderProps) {
  return (
    <div className="auth-header">
      <div className="auth-logo-container">
        <div className="auth-logo">
          <img src={moonIcon} alt="moon icon" />
        </div>
        <h1 className="auth-title">mong</h1>
      </div>

      <div>
        <h4 className="auth-subtitle">{title}</h4>
        <p className="auth-description">{description}</p>
      </div>

      {/* Stepper - 회원가입에서만 사용 */}
      {showStepper && steps && (
        <div className="auth-stepper">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className={`stepper-step ${currentStep && currentStep >= index + 1 ? (step.completed ? 'completed' : 'current') : ''}`}>
                <div className="stepper-step-icon">
                  {step.completed ? (
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
                  ) : (
                    step.icon
                  )}
                </div>
                <span className="stepper-step-label">{step.label}</span>
              </div>
              {index < steps.length - 1 && <div className="stepper-connector" />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
