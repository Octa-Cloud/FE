/**
 * 폼 유효성 검사를 위한 커스텀 훅
 */
import { useState, useCallback } from 'react';
import { 
  validateEmail, 
  validatePassword, 
  validatePasswordConfirm, 
  validateName, 
  validateBirthDate, 
  validateGender,
  validateRequiredFields
} from '../utils/validation';
import { FormValidationState } from '../types/utils';

// FormValidationState는 이미 utils.ts에서 import됨

export function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState<boolean>(true);

  // 에러 설정
  const setError = useCallback((field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
    setIsValid(false);
  }, []);

  // 에러 제거
  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    
    // 모든 에러가 제거되었는지 확인
    const remainingErrors = Object.keys(errors).filter(key => key !== field);
    setIsValid(remainingErrors.length === 0);
  }, [errors]);

  // 모든 에러 제거
  const clearAllErrors = useCallback(() => {
    setErrors({});
    setIsValid(true);
  }, []);

  // 이메일 검증
  const validateEmailField = useCallback((email: string, fieldName: string = 'email') => {
    const result = validateEmail(email);
    if (!result.isValid) {
      setError(fieldName, result.message || '');
      return false;
    } else {
      clearError(fieldName);
      return true;
    }
  }, [setError, clearError]);

  // 비밀번호 검증
  const validatePasswordField = useCallback((password: string, fieldName: string = 'password') => {
    const result = validatePassword(password);
    if (!result.isValid) {
      setError(fieldName, result.message || '');
      return false;
    } else {
      clearError(fieldName);
      return true;
    }
  }, [setError, clearError]);

  // 비밀번호 확인 검증
  const validatePasswordConfirmField = useCallback((
    password: string, 
    confirmPassword: string, 
    fieldName: string = 'confirmPassword'
  ) => {
    const result = validatePasswordConfirm(password, confirmPassword);
    if (!result.isValid) {
      setError(fieldName, result.message || '');
      return false;
    } else {
      clearError(fieldName);
      return true;
    }
  }, [setError, clearError]);

  // 이름 검증
  const validateNameField = useCallback((name: string, fieldName: string = 'name') => {
    const result = validateName(name);
    if (!result.isValid) {
      setError(fieldName, result.message || '');
      return false;
    } else {
      clearError(fieldName);
      return true;
    }
  }, [setError, clearError]);

  // 생년월일 검증
  const validateBirthDateField = useCallback((
    birthYear: string, 
    birthMonth: string, 
    birthDay: string, 
    fieldName: string = 'birthDate'
  ) => {
    const result = validateBirthDate(birthYear, birthMonth, birthDay);
    if (!result.isValid) {
      setError(fieldName, result.message || '');
      return false;
    } else {
      clearError(fieldName);
      return true;
    }
  }, [setError, clearError]);

  // 성별 검증
  const validateGenderField = useCallback((gender: string, fieldName: string = 'gender') => {
    const result = validateGender(gender);
    if (!result.isValid) {
      setError(fieldName, result.message || '');
      return false;
    } else {
      clearError(fieldName);
      return true;
    }
  }, [setError, clearError]);

  // 전체 폼 검증 (회원가입용)
  const validateForm = useCallback((data: {
    email?: string;
    name?: string;
    birthYear?: string;
    birthMonth?: string;
    birthDay?: string;
    gender?: string;
    password?: string;
    confirmPassword?: string;
  }) => {
    const result = validateRequiredFields(data);
    if (!result.isValid) {
      // 첫 번째 에러 필드에 에러 설정
      if (data.email && !validateEmail(data.email).isValid) {
        setError('email', validateEmail(data.email).message || '');
      } else if (data.name && !validateName(data.name).isValid) {
        setError('name', validateName(data.name).message || '');
      } else if (data.birthYear && data.birthMonth && data.birthDay && 
                 !validateBirthDate(data.birthYear, data.birthMonth, data.birthDay).isValid) {
        setError('birthDate', validateBirthDate(data.birthYear, data.birthMonth, data.birthDay).message || '');
      } else if (data.gender && !validateGender(data.gender).isValid) {
        setError('gender', validateGender(data.gender).message || '');
      } else if (data.password && !validatePassword(data.password).isValid) {
        setError('password', validatePassword(data.password).message || '');
      } else if (data.confirmPassword && !validatePasswordConfirm(data.password || '', data.confirmPassword).isValid) {
        setError('confirmPassword', validatePasswordConfirm(data.password || '', data.confirmPassword).message || '');
      } else {
        // 일반적인 에러 메시지
        setError('general', result.message || '입력 정보를 확인해주세요.');
      }
      return false;
    } else {
      clearAllErrors();
      return true;
    }
  }, [setError, clearAllErrors]);

  return {
    errors,
    isValid,
    setError,
    clearError,
    clearAllErrors,
    validateEmailField,
    validatePasswordField,
    validatePasswordConfirmField,
    validateNameField,
    validateBirthDateField,
    validateGenderField,
    validateForm
  };
}

/**
 * 실시간 폼 검증을 위한 훅
 */
export function useRealTimeValidation() {
  const validation = useFormValidation();

  const validateField = useCallback((field: string, value: string, type: string) => {
    switch (type) {
      case 'email':
        return validation.validateEmailField(value, field);
      case 'password':
        return validation.validatePasswordField(value, field);
      case 'name':
        return validation.validateNameField(value, field);
      default:
        return true;
    }
  }, [validation]);

  return {
    ...validation,
    validateField
  };
}
