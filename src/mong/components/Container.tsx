import React from 'react';
import { ContainerProps } from '../types';

const Container = React.memo<ContainerProps>(({ children, width = 896, className = '' }) => {
  return (
    <div 
      className={`w-full mx-auto ${className}`}
      style={{ maxWidth: width }}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';

export default Container;
