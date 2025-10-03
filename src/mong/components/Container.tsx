import React from 'react';
import { ContainerProps } from '../types';

export default function Container({ children, width = 896, className = '' }: ContainerProps) {
  return (
    <div 
      className={`w-full mx-auto ${className}`}
      style={{ maxWidth: width }}
    >
      {children}
    </div>
  );
}
