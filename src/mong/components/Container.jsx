import React from 'react'

export default function Container({ children, width = 896, className = '' }) {
  return (
    <div 
      className={`w-full mx-auto ${className}`}
      style={{ maxWidth: width }}
    >
      {children}
    </div>
  )
}


