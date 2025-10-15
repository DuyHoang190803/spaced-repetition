import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ChecklistItem } from './ChecklistItem';
import { ChecklistForm } from './ChecklistForm';
import { MONTH_NAMES_SHORT } from '../../constants';
import { getDaysInMonth } from '../../utils';
import './Checklist.css';

export const ChecklistContainer = ({ checklistData }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editingHabit, setEditingHabit] = useState(null);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const { checklist, toggleCheck, addHabit, deleteHabit, renameHabit, isChecked } = checklistData;

  const daysInMonth = getDaysInMonth(currentMonth);

  const handleAddHabit = (habitName) => {
    addHabit(habitName);
    setShowAddHabit(false);
  };

  const handleRename = (oldName, newName) => {
    renameHabit(oldName, newName);
    setEditingHabit(null);
  };

  return (
    <div className="checklist-page">
      <div className="checklist-container">
        <div className="checklist-header">
          <h1 className="checklist-title">Daily Checklist</h1>
          <div className="checklist-controls">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="checklist-nav">
              <ChevronLeft className="checklist-nav-icon" />
            </button>
            <h2 className="checklist-month">{MONTH_NAMES_SHORT[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h2>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="checklist-nav">
              <ChevronRight className="checklist-nav-icon" />
            </button>
          </div>
          <p className="checklist-sub">Track your daily habits and build consistency</p>
        </div>

        <div className="checklist-board">
          <div className="checklist-board-inner">
            <div className="checklist-board-top">
              <div className="checklist-habits-label">
                <span>Habits</span>
                <button onClick={() => setShowAddHabit(true)} className="checklist-add">+ Add Habit</button>
              </div>
              <div className="checklist-days">
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <span key={i} className="checklist-day">{i + 1}</span>
                ))}
              </div>
            </div>

            <div className="checklist-rows">
              {Object.keys(checklist).map((habit, habitIdx) => (
                <ChecklistItem
                  key={habit}
                  habit={habit}
                  habitIdx={habitIdx}
                  daysInMonth={daysInMonth}
                  currentMonth={currentMonth}
                  editingHabit={editingHabit}
                  onEdit={setEditingHabit}
                  onDelete={deleteHabit}
                  onRename={handleRename}
                  onToggle={toggleCheck}
                  isChecked={isChecked}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="checklist-note">Click on any day to mark it complete. Edit or delete habits by hovering over them.</div>
      </div>

      <ChecklistForm isOpen={showAddHabit} onClose={() => setShowAddHabit(false)} onAddHabit={handleAddHabit} />
    </div>
  );
};