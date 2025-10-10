import React from 'react';
import { ContainerProps } from '../types';

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
        style={{ maxWidth: width }}
      >
        {children}
      </div>
    </div>
  );
});

Container.displayName = 'Container';

export default Container;
