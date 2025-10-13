import React from 'react'

export default function Container({ children, width = 896 }) {
  const style = {
    width: '100%',
    maxWidth: width,
    margin: '0 auto',
  }

  return <div style={style}>{children}</div>
}
