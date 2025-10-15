import React from 'react';
import './Badge.css';

export const Badge = ({ children, color = 'dark', className = '' }) => {
  // map a few semantic color keys to badge-* classes
  const colorMap = {
    'gray-800': 'dark',
    'gray-700': 'dark',
    'gray-600': 'dark',
    'gray-500': 'dark',
    'gray-300': 'light',
    'gray-200': 'light',
    'black': 'dark',
    'red': 'red',
    'yellow': 'yellow',
    'green': 'green'
  };

  const resolved = colorMap[color] || color;
  const classes = ['badge', `badge-${resolved}`, className].filter(Boolean).join(' ');

  return <span className={classes}>{children}</span>;
};