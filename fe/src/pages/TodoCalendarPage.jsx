import React from 'react';
import { CalendarView } from '../components/TodoCalendar';

export const TodoCalendarPage = ({ todosData }) => {
  return <CalendarView todosData={todosData} />;
};