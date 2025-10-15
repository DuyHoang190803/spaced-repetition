import React from 'react';
import './Button.css';

export const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const classes = ['btn', `btn-${variant}`, className].filter(Boolean).join(' ');

  return (
    <button onClick={onClick} className={classes} {...props}>
      {children}
    </button>
  );
};