import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import './cardfooter.css';

export const CardFooter = ({ note, onEdit, onDelete }) => {
  return (
      <div className="card-footer">
        <div className="card-footer-left">Lần ôn thứ {note?.reviewCount + 1}</div>
        <div className="card-footer-actions">
          <button onClick={() => onEdit?.(note)} className="card-footer-btn"><Edit2 className="card-footer-icon" /></button>
          <button onClick={() => onDelete?.(note)} className="card-footer-btn delete"><Trash2 className="card-footer-icon" /></button>
      </div>
    </div>
  );
};
import './cardfooter.css';
