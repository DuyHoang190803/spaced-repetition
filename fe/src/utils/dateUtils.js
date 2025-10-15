export const calculateNextReviewTime = (currentColumnId, columns) => {
  const column = columns.find(col => col.id === currentColumnId);
  if (!column || !column.nextInterval) return null;
  const now = new Date();
  const nextReviewDate = new Date(now.getTime() + column.nextInterval * 60 * 1000);
  return nextReviewDate.toISOString();
};

export const formatDateTime = (isoString) => {
  if (!isoString) return 'Hoàn thành';
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

export const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export const formatDateKey = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const isToday = (date, day) => {
  const today = new Date();
  return date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear() && 
         day === today.getDate();
};