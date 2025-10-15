import React from 'react';

export const DatePicker = ({ value, onChange }) => (
  <input type="date" value={value} onChange={(e) => onChange?.(e.target.value)} className="todoform-input" />
);
