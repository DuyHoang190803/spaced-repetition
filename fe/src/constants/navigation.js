import { Repeat, Calendar, CheckSquare } from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { id: 'spaced-repetition', label: 'Spaced Repetition', icon: Repeat },
  { id: 'todo-calendar', label: 'Todo & Calendar', icon: Calendar },
  { id: 'daily-checklist', label: 'Daily Checklist', icon: CheckSquare }
];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];