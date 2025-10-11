import { User } from './common';

// 컴포넌트 Props 타입 정의
export interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'date';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  maxLength?: number;
  className?: string;
  children?: React.ReactNode;
  showPasswordToggle?: boolean;
  buttons?: React.ReactNode;
  showStatusIndicator?: boolean;
  statusIcon?: React.ReactNode;
}

export interface ShortFormFieldProps {
  label: string;
  id: string;
  name?: string;
  type?: 'text' | 'email' | 'password' | 'tel';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  maxLength?: number;
  className?: string;
  options?: Array<{ value: string; label: string }>;
  showPasswordToggle?: boolean;
}

export interface AuthButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export interface AuthHeaderProps {
  title: string;
  description: string;
  showStepper?: boolean;
  currentStep?: number;
  steps?: StepperStep[];
}

export interface StepperStep {
  label: string;
  icon: React.ReactNode;
  completed?: boolean;
}

export interface AuthFooterProps {
  text: string;
  linkText: string;
  onLinkClick: () => void;
  className?: string;
}

export interface ContainerProps {
  children: React.ReactNode;
  width?: number;
  className?: string;
  backgroundColor?: string;
  minHeight?: string;
  textColor?: string;
  centered?: boolean; // 중앙 정렬 여부
}

export interface NavBarProps {
  onStartSleepRecord?: () => void;
  userProfile: {
    name: string;
    avatar?: string;
    email?: string;
  };
  onLogout?: () => void;
}

export interface ProfileStatsCardProps {
  userData: {
    name: string;
    email: string;
    avatar: string;
    averageScore: number;
    averageSleepTime: number;
    totalDays: number;
  };
}

export interface BasicInfoFormProps {
  userData: {
    name: string;
    email: string;
    birthDate: string;
    gender: string;
  };
  tempFormData?: Partial<{
    name: string;
    email: string;
    birthDate: string;
    gender: string;
  }>;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (formData: any) => void;
  onCancel: () => void;
  onFormDataChange?: (formData: any) => void;
}

export interface ProfileFooterProps {
  isEditing: boolean;
  isLoading?: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  editText?: string;
  saveText?: string;
  cancelText?: string;
  loadingText?: string;
}
