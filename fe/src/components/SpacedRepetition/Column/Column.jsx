import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardForm } from '../Card';
import { COLUMNS } from '../../../constants';
import { ColumnHeader } from './ColumnHeader';
import { calculateNextReviewTime } from '../../../utils';
import './Column.css';

export const Column = ({ column, notes, onDragOver, onDrop, showForm, onShowForm, onAddNote, draggedNote, setDraggedNote }) => {
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const handleAddNote = () => {
    if (!newNote.title.trim()) return;
    const note = {
      title: newNote.title,
      content: newNote.content,
      currentPosition: column.id,
      reviewCount: 0,
      nextReviewTime: calculateNextReviewTime(column.id, COLUMNS),
      createdAt: new Date().toISOString()
    };
    onAddNote(note);
    setNewNote({ title: '', content: '' });
    onShowForm(null);
  };

  const handleDragStart = (e, note) => {
    setDraggedNote(note);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      onDragOver={(e) => onDragOver(e, column.id)}
      onDrop={(e) => onDrop(e, column.id)}
      className="column"
    >
      <ColumnHeader
        label={column.label}
        count={notes.length}
        showAdd={column.id === '0m'}
        onAdd={() => onShowForm(column.id)}
      />

      <div className="column-body">
        {/* show form at top for column 0m */}
        {column.id === '0m' && showForm === column.id && (
          <CardForm
            onSubmit={handleAddNote}
            onCancel={() => {
              onShowForm(null);
              setNewNote({ title: '', content: '' });
            }}
            newNote={newNote}
            setNewNote={setNewNote}
          />
        )}

        {notes.map(note => (
          <Card 
            key={note._id || note.id} 
            note={note}
            onDragStart={(e) => handleDragStart(e, note)}
          />
        ))}
      </div>
    </div>
  );
};