import React from "react";
import moonIcon from "../assets/moonIcon.svg";
import { AuthHeaderProps } from "../types";

export default function AuthHeader({ title, description, showStepper, currentStep, steps }: AuthHeaderProps) {
  return (
    <div className="auth-header">
      <div className="flex flex-col items-center gap-3">
        <div className="auth-logo">
          <img src={moonIcon} alt="moon icon" className="w-8 h-8" />
        </div>
        <h1 className="auth-brand-name">mong</h1>
      </div>

      <div className="mt-4">
        <h4 className="auth-header-title">{title}</h4>
        <p className="auth-header-description">{description}</p>
      </div>

      {/* Stepper - 회원가입에서만 사용 */}
      {showStepper && steps && (
        <div className="auth-stepper flex items-center justify-center">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className={`flex items-center gap-2 flex-shrink-0 min-w-fit ${currentStep && currentStep >= index + 1 ? (step.completed ? 'stepper-step completed text-emerald-500' : 'stepper-step current') : 'stepper-step'}`}>
                <div className="stepper-step-icon w-10 h-10 flex items-center justify-center border-2">
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
                      className="w-5 h-5"
                    >
                      <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                      <path d="m9 11 3 3L22 4"></path>
                    </svg>
                  ) : (
                    step.icon
                  )}
                </div>
                <span className="text-sm font-medium whitespace-nowrap text-center">{step.label}</span>
              </div>
              {index < steps.length - 1 && <div className="stepper-connector w-8 h-1" />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
