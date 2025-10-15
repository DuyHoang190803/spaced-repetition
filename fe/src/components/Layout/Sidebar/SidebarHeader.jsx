import React from 'react';
import { Menu, X } from 'lucide-react';
import './SidebarHeader.css';

export const SidebarHeader = ({ isOpen, onToggle }) => (
    <div className={`sidebar-header ${isOpen ? 'open' : 'collapsed'}`}>
        {isOpen && <h1 className="sidebar-title">HellO WolrD</h1>}
        <button onClick={onToggle} className="sidebar-toggle" type="button">
            {isOpen ? <X className="sidebar-toggle-icon" /> : <Menu className="sidebar-toggle-icon" />}
        </button>
    </div>
);