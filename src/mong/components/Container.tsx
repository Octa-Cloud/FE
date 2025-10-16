import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  width?: number | string;
  className?: string;
  backgroundColor?: string;
  minHeight?: string;
  textColor?: string;
  centered?: boolean;
}

const Container = React.memo<ContainerProps>(({ 
  children, 
  width = 896, 
  className = '', 
  backgroundColor, 
  minHeight = '100vh', 
  textColor,
  centered = false
}) => {
  const outerClasses = centered 
    ? 'flex items-center justify-center min-h-screen'
    : '';

  // width가 문자열인 경우 (예: "100vw") 그대로 사용, 숫자인 경우 maxWidth로 사용
  const widthStyle = typeof width === 'string' 
    ? { width: width }
    : { maxWidth: width };

  return (
    <div 
      className={outerClasses}
      style={{ 
        backgroundColor, 
        minHeight: centered ? '100vh' : minHeight, 
        color: textColor,
        padding: centered ? '0' : undefined
      }}
    >
      <div 
        className={centered ? `${className}` : `w-full mx-auto ${className}`}
        style={widthStyle}
      >
        {children}
      </div>
    </div>
  );
});

Container.displayName = 'Container';

export default Container;
