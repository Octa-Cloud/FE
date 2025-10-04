/**
 * 유효성 검사 유틸리티 함수들
 */

import { ValidationResult, PasswordValidation } from '../types/utils';

/**
 * 이메일 유효성 검사
 */
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email.trim()) {
    return { isValid: false, message: '이메일을 입력해주세요.' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: '올바른 이메일 형식을 입력해주세요.' };
  }
  
  return { isValid: true };
};

/**
 * 비밀번호 유효성 검사
 */
export const validatePassword = (password: string): PasswordValidation => {
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  const isValid = hasLowerCase && hasNumber && hasSpecialChar;
  
  if (!isValid) {
    const missingRequirements = [];
    if (!hasLowerCase) missingRequirements.push('소문자');
    if (!hasNumber) missingRequirements.push('숫자');
    if (!hasSpecialChar) missingRequirements.push('특수문자');
    
    return {
      isValid: false,
      message: `비밀번호는 ${missingRequirements.join(', ')}를 포함해야 합니다.`,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    };
  }
  
  return {
    isValid: true,
    hasLowerCase,
    hasNumber,
    hasSpecialChar
  };
};

/**
 * 비밀번호 확인 검사
 */
export const validatePasswordConfirm = (password: string, confirmPassword: string): ValidationResult => {
  if (!confirmPassword) {
    return { isValid: false, message: '비밀번호 확인을 입력해주세요.' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: '비밀번호가 일치하지 않습니다.' };
  }
  
  return { isValid: true };
};

/**
 * 이름 유효성 검사
 */
export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, message: '이름을 입력해주세요.' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, message: '이름은 2자 이상이어야 합니다.' };
  }
  
  return { isValid: true };
};

/**
 * 생년월일 유효성 검사
 */
export const validateBirthDate = (birthYear: string, birthMonth: string, birthDay: string): ValidationResult => {
  if (!birthYear || !birthMonth || !birthDay) {
    return { isValid: false, message: '생년월일을 모두 입력해주세요.' };
  }
  
  const year = parseInt(birthYear);
  const month = parseInt(birthMonth);
  const day = parseInt(birthDay);
  
  const currentYear = new Date().getFullYear();
  
  if (year < 1900 || year > currentYear) {
    return { isValid: false, message: '올바른 출생년도를 입력해주세요.' };
  }
  
  if (month < 1 || month > 12) {
    return { isValid: false, message: '올바른 출생월을 입력해주세요.' };
  }
  
  if (day < 1 || day > 31) {
    return { isValid: false, message: '올바른 출생일을 입력해주세요.' };
  }
  
  // 실제 날짜 유효성 검사
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return { isValid: false, message: '올바른 날짜를 입력해주세요.' };
  }
  
  return { isValid: true };
};

/**
 * 성별 유효성 검사
 */
export const validateGender = (gender: string): ValidationResult => {
  if (!gender) {
    return { isValid: false, message: '성별을 선택해주세요.' };
  }
  
  const validGenders = ['남', '여'];
  if (!validGenders.includes(gender)) {
    return { isValid: false, message: '올바른 성별을 선택해주세요.' };
  }
  
  return { isValid: true };
};

/**
 * 수면 시간 유효성 검사
 */
export const validateSleepHours = (sleepHours: number): ValidationResult => {
  if (sleepHours < 1 || sleepHours > 24) {
    return { isValid: false, message: '수면 시간은 1시간에서 24시간 사이여야 합니다.' };
  }
  
  return { isValid: true };
};

/**
 * 시간 형식 유효성 검사
 */
export const validateTimeFormat = (time: string): ValidationResult => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  
  if (!time) {
    return { isValid: false, message: '시간을 입력해주세요.' };
  }
  
  if (!timeRegex.test(time)) {
    return { isValid: false, message: '올바른 시간 형식을 입력해주세요. (HH:MM)' };
  }
  
  return { isValid: true };
};

/**
 * 필수 필드 검증 (회원가입용)
 */
export const validateRequiredFields = (data: {
  email?: string;
  name?: string;
  birthYear?: string;
  birthMonth?: string;
  birthDay?: string;
  gender?: string;
  password?: string;
  confirmPassword?: string;
}): ValidationResult => {
  // 우선순위: 이메일 -> 이름 -> 생년월일 -> 성별 -> 비밀번호 -> 비밀번호 확인
  const emailValidation = validateEmail(data.email || '');
  if (!emailValidation.isValid) return emailValidation;
  
  const nameValidation = validateName(data.name || '');
  if (!nameValidation.isValid) return nameValidation;
  
  const birthDateValidation = validateBirthDate(
    data.birthYear || '', 
    data.birthMonth || '', 
    data.birthDay || ''
  );
  if (!birthDateValidation.isValid) return birthDateValidation;
  
  const genderValidation = validateGender(data.gender || '');
  if (!genderValidation.isValid) return genderValidation;
  
  const passwordValidation = validatePassword(data.password || '');
  if (!passwordValidation.isValid) return passwordValidation;
  
  const passwordConfirmValidation = validatePasswordConfirm(
    data.password || '', 
    data.confirmPassword || ''
  );
  if (!passwordConfirmValidation.isValid) return passwordConfirmValidation;
  
  return { isValid: true };
};
