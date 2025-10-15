import React from 'react';
import { SidebarHeader } from './SidebarHeader';
import { SidebarItem } from './SidebarItem';
import { NAVIGATION_ITEMS } from '../../../constants';
import './Sidebar.css';

export const Sidebar = ({ activeTab, onTabChange, isOpen, onToggle }) => {
  const wrapperClass = isOpen ? 'sidebar sidebar-open' : 'sidebar sidebar-closed';

  return (
    <div className={wrapperClass}>
      <SidebarHeader isOpen={isOpen} onToggle={onToggle} />

      <nav className="sidebar-nav">
        {NAVIGATION_ITEMS.map(tab => (
          <SidebarItem
            key={tab.id}
            tab={tab}
            isActive={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            isOpen={isOpen}
          />
        ))}
      </nav>
    </div>
  );
};