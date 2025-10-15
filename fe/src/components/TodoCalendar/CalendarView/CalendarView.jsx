import React, { useState } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { DayCell } from './DayCell';
import { TodoForm } from '../TodoForm';
import { DAY_NAMES } from '../../../constants';
import { getDaysInMonth, getFirstDayOfMonth, formatDateKey, isToday } from '../../../utils';
import '../calendar.css';

export const CalendarView = ({ todosData }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showAddTask, setShowAddTask] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const { tasks, addTask, toggleTask, deleteTask, getTasksForDate } = todosData;

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);

    const handleDateClick = (day) => {
        const dateStr = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(dateStr);
        setShowAddTask(true);
    };

    const handleAddTask = (taskData) => {
        addTask({ ...taskData, done: false });
        setShowAddTask(false);
        setSelectedDate(null);
    };

    return (
        <div className="calendar-page">
            <div className="calendar-hero">
                <h1 className="calendar-hero-title">Calendar and To Do List</h1>
                <p className="calendar-hero-sub">Organize your tasks and visualize them in a calendar</p>
            </div>

            <CalendarHeader currentDate={currentDate} onPrevMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} onNextMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} onToday={() => setCurrentDate(new Date())} />

            <div className="calendar-body">
                <div className="calendar-weekdays">
                    {DAY_NAMES.map(day => (<div key={day} className="calendar-weekday">{day}</div>))}
                </div>

                <div className="calendar-grid">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (<div key={`empty-${i}`} className="calendar-empty" />))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
                        const dayTasks = getTasksForDate(dateStr);
                        const isTodayDate = isToday(currentDate, day);

                        return (<DayCell key={day} day={day} isToday={isTodayDate} tasks={dayTasks} onDateClick={handleDateClick} onToggleTask={toggleTask} onDeleteTask={deleteTask} />);
                    })}
                </div>
            </div>

            <TodoForm isOpen={showAddTask} onClose={() => { setShowAddTask(false); setSelectedDate(null); }} onSubmit={handleAddTask} selectedDate={selectedDate} />
        </div>
    );
};