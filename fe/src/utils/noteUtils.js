export const getNoteStatus = (note) => {
  if (!note.nextReviewTime) return 'completed';
  const now = new Date();
  const nextReview = new Date(note.nextReviewTime);
  const diffMinutes = (nextReview - now) / (60 * 1000);
  if (diffMinutes < 0) return 'overdue';
  if (diffMinutes < 60) return 'due-soon';
  return 'on-track';
};

export const filterByColumn = (notes, columnId) => {
  return notes.filter(note => note.currentPosition === columnId);
};