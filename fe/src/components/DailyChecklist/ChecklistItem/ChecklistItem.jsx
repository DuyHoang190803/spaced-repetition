import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { CHECKLIST_COLORS } from '../../../constants';
import { formatDateKey } from '../../../utils';
import './ChecklistItem.css';

export const ChecklistItem = ({ habit, habitIdx, daysInMonth, currentMonth, editingHabit, onEdit, onDelete, onRename, onToggle, isChecked }) => (
  <div className="checklist-row">
    <div className={['checklist-habit', `checklist-habit-${habitIdx % CHECKLIST_COLORS.length}`].filter(Boolean).join(' ')}>
      {editingHabit === habit ? (
        <input
          type="text"
          defaultValue={habit}
          onBlur={(e) => onRename(habit, e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onRename(habit, e.target.value);
            }
          }}
          className="checklist-habit-input"
          autoFocus
        />
      ) : (
        <>
          <span className="checklist-habit-name">{habit}</span>
          <div className="checklist-habit-actions">
            <button onClick={() => onEdit(habit)} className="checklist-action-btn"><Edit2 className="checklist-action-icon" /></button>
            <button onClick={() => onDelete(habit)} className="checklist-action-btn delete"><Trash2 className="checklist-action-icon" /></button>
          </div>
        </>
      )}
    </div>
    <div className="checklist-days">
      {Array.from({ length: daysInMonth }, (_, dayIdx) => {
        const dateKey = formatDateKey(currentMonth.getFullYear(), currentMonth.getMonth(), dayIdx + 1);
        const checked = isChecked(habit, dateKey);
        return (
          <button key={dayIdx} onClick={() => onToggle(habit, dateKey)} className={['checklist-day-cell', checked ? 'checked' : ''].filter(Boolean).join(' ')}>
            {checked && <span className="checkmark">✓</span>}
          </button>
        );
      })}
    </div>
  </div>
);