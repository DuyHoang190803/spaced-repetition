import React from 'react';
import './ChecklistStats.css';

export const ChecklistStats = ({ totalHabits = 0, completed = 0 }) => {
	return (
		<div className="checklist-stats">
			<div className="checklist-stat">Habits: <span className="checklist-stat-value">{totalHabits}</span></div>
			<div className="checklist-stat">Completed: <span className="checklist-stat-value">{completed}</span></div>
		</div>
	);
};
