import React from 'react';
import './SidebarItem.css';

export const SidebarItem = ({ tab, isActive, onClick, isOpen }) => {
  const Icon = tab.icon;
  const className = isActive ? 'sidebar-item active' : 'sidebar-item';

  return (
    <button onClick={onClick} className={className} type="button">
      <Icon className="sidebar-icon" />
      {isOpen && <span className="sidebar-label">{tab.label}</span>}
    </button>
  );
};