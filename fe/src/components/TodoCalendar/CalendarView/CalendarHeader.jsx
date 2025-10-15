import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../common/Button';
import { MONTH_NAMES } from '../../../constants';
import '../calendar.css';

export const CalendarHeader = ({ currentDate, onPrevMonth, onNextMonth, onToday }) => (
  <div className="calendar-header">
    <div className="calendar-header-left">
      <button onClick={onPrevMonth} className="calendar-nav"><ChevronLeft className="calendar-nav-icon" /></button>
      <h2 className="calendar-title">{MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
      <button onClick={onNextMonth} className="calendar-nav"><ChevronRight className="calendar-nav-icon" /></button>
    </div>
    <Button onClick={onToday} className="text-sm">Today</Button>
  </div>
);