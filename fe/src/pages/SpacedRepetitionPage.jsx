import React from 'react';
import { Dashboard } from '../components/SpacedRepetition/Dashboard';
import { Board } from '../components/SpacedRepetition/Board';
import './spacedrepetition.css';

export const SpacedRepetitionPage = ({ notesData }) => {
  return (
    <div className="spaced-page">
      {/* <div className="spaced-header">
        <h1>Spaced Repetition Board</h1>
      </div> */}
      <Dashboard notes={notesData.notes} />
      <Board notesData={notesData} onUpdateNote={notesData.updateNote} onAddNote={notesData.addNote} />
    </div>
  );
};