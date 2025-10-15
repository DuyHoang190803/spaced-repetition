import React from 'react';
import { Badge } from '../../common/Badge';
import { CATEGORY_COLORS } from '../../../constants';
import '../calendar.css';

export const DayCell = ({ day, isToday, tasks, onDateClick, onToggleTask, onDeleteTask }) => (
  <div onClick={() => onDateClick(day)} className={['daycell', isToday ? 'daycell-today' : ''].filter(Boolean).join(' ')}>
    <div className={['daycell-number', isToday ? 'daycell-number-today' : ''].filter(Boolean).join(' ')}>{day}</div>
    <div className="daycell-tasks">
      {tasks.map(task => (
        <div key={task.id} className="daycell-task" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={task.done} onChange={() => onToggleTask(task.id)} className="daycell-checkbox" />
          <div className="daycell-task-body">
            <p className={['daycell-task-title', task.done ? 'done' : ''].filter(Boolean).join(' ')}>{task.title}</p>
            <div className="daycell-task-meta">
              <Badge color={CATEGORY_COLORS[task.category]}>{task.category}</Badge>
              {task.time && <span className="daycell-task-time">{task.time}</span>}
            </div>
          </div>
          <button onClick={() => onDeleteTask(task.id)} className="daycell-delete">×</button>
        </div>
      ))}
    </div>
  </div>
);