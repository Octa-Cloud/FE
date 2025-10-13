import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

/**
 * 로딩 스피너 컴포넌트
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = '데이터를 불러오는 중...' 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 border-4 border-[#2a2a2a] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-[#00d4aa] rounded-full animate-spin"></div>
      </div>
      {text && (
        <p className="mt-4 text-sm text-[#a1a1aa]">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;

