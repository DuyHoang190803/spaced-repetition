import React, { useState } from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { CATEGORY_COLORS } from '../../../constants';
import './todoform.css';

export const TodoForm = ({ isOpen, onClose, onSubmit, selectedDate }) => {
  const [newTask, setNewTask] = useState({ title: '', category: 'Errand', time: '' });

  const handleSubmit = () => {
    if (!newTask.title.trim()) return;
    onSubmit({ ...newTask, date: selectedDate });
    setNewTask({ title: '', category: 'Errand', time: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Task">
      <div className="todoform">
        <div className="todoform-row">
          <label className="todoform-label">Task Title</label>
            <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="input-title" placeholder="Enter task title..." autoFocus />
        </div>
        <div className="todoform-row">
          <label className="todoform-label">Category</label>
          <select value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value })} className="todoform-input">
            {Object.keys(CATEGORY_COLORS).map(cat => (<option key={cat} value={cat}>{cat}</option>))}
          </select>
        </div>
        <div className="todoform-row">
          <label className="todoform-label">Time (optional)</label>
            <input type="time" value={newTask.time} onChange={(e) => setNewTask({ ...newTask, time: e.target.value })} className="input-time" />
        </div>

        <div className="todoform-actions">
          <Button onClick={handleSubmit} className="todoform-btn">Add Task</Button>
          <Button onClick={onClose} variant="secondary" className="todoform-btn">Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};