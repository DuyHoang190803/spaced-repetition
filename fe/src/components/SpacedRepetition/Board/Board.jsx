import React, { useState } from 'react';
import { Column } from '../Column';
import { COLUMNS } from '../../../constants';
import { filterByColumn, calculateNextReviewTime } from '../../../utils';
import './Board.css';

export const Board = ({ notesData, onUpdateNote, onAddNote }) => {
  
  const { notes, draggedNote, setDraggedNote } = notesData;
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [showAddForm, setShowAddForm] = useState(null);

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (!draggedNote) return;

    const currentColIndex = COLUMNS.findIndex(col => col.id === draggedNote.currentPosition);
    const targetColIndex = COLUMNS.findIndex(col => col.id === targetColumnId);
    const isMovingForward = targetColIndex > currentColIndex;
    const isNextColumn = targetColIndex === currentColIndex + 1;

    if (isMovingForward && !isNextColumn) return;

    const noteId = draggedNote._id || draggedNote.id;
    onUpdateNote(noteId, {
      currentPosition: targetColumnId,
      // reviewCount: isMovingForward ? draggedNote.reviewCount + 1 : draggedNote.reviewCount,
      // nextReviewTime: calculateNextReviewTime(targetColumnId, COLUMNS)
    });
    setDraggedNote(null);
  };

  return (
    <div className="board-outer">
      <div className="board-inner">
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            column={column}
            notes={filterByColumn(notes, column.id)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            showForm={showAddForm}
            onShowForm={setShowAddForm}
            onAddNote={onAddNote}
            draggedNote={draggedNote}
            setDraggedNote={setDraggedNote}
          />
        ))}
      </div>
    </div>
  );
};