import { useState } from 'react';

export const useTodos = () => {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks(prev => [...prev, { ...task, id: Date.now() }]);
  };

  const toggleTask = (taskId) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, done: !task.done } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => task.date === date);
  };

  return { 
    tasks, 
    addTask, 
    toggleTask, 
    deleteTask,
    getTasksForDate
  };
};