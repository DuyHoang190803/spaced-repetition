import React from 'react';
import './statcard.css';

export const StatCard = ({ icon: Icon, label, value, className = '' }) => (
  <div className={`statcard ${className}`}>
    <div className="statcard-icon">
      <Icon className={`statcard-icon-svg`} />
    </div>
    <div className="statcard-body">
      <p className="statcard-label">{label}</p>
      <p className={`statcard-value`}>{value}</p>
    </div>
  </div>
);