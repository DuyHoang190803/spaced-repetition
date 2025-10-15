import { useState } from 'react';

export const useChecklist = () => {
  const [checklist, setChecklist] = useState({
    'Drink Water': {},
    'Take Vitamins': {},
    'Meditation Time': {},
    'Exercise Routine': {},
    'Take Morning Sunlight': {},
    'Skincare Routine': {},
    'Daily Walk': {},
    'Eat 3 Veggies': {},
    'Get 8 Hours Sleep': {},
    'No Social Media': {}
  });

  const toggleCheck = (habit, dateKey) => {
    setChecklist(prev => ({
      ...prev,
      [habit]: {
        ...prev[habit],
        [dateKey]: !prev[habit][dateKey]
      }
    }));
  };

  const addHabit = (habitName) => {
    setChecklist(prev => ({
      ...prev,
      [habitName]: {}
    }));
  };

  const deleteHabit = (habit) => {
    const newChecklist = { ...checklist };
    delete newChecklist[habit];
    setChecklist(newChecklist);
  };

  const renameHabit = (oldName, newName) => {
    if (!newName.trim() || newName === oldName) return;
    const newChecklist = {};
    Object.keys(checklist).forEach(key => {
      newChecklist[key === oldName ? newName : key] = checklist[key];
    });
    setChecklist(newChecklist);
  };

  const isChecked = (habit, dateKey) => {
    return checklist[habit]?.[dateKey] || false;
  };

  return {
    checklist,
    toggleCheck,
    addHabit,
    deleteHabit,
    renameHabit,
    isChecked
  };
};