import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import './ChecklistForm.css';

export const ChecklistForm = ({ isOpen, onClose, onAddHabit }) => {
  const [habitToAdd, setHabitToAdd] = useState('');

  const handleSubmit = () => {
    if (!habitToAdd.trim()) return;
    onAddHabit(habitToAdd);
    setHabitToAdd('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Habit">
      <input
        type="text"
        value={habitToAdd}
        onChange={(e) => setHabitToAdd(e.target.value)}
        className="modal-form-input"
        placeholder="Enter habit name..."
        autoFocus
      />
      <div className="checklistform-actions">
        <Button onClick={handleSubmit} className="checklistform-btn">Add Habit</Button>
        <Button onClick={onClose} variant="secondary" className="checklistform-btn">Cancel</Button>
      </div>
    </Modal>
  );
};