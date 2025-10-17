import React, { useState } from 'react';
import { Sidebar, MainLayout } from './components/Layout';
import { SpacedRepetitionPage, TodoCalendarPage, DailyChecklistPage } from './pages';
import { useNotes, useTodos, useChecklist } from './hooks';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('spaced-repetition');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const notesData = useNotes();
  
  const todosData = useTodos();
  const checklistData = useChecklist();
  
  const renderPage = () => {
    switch(activeTab) {
      case 'spaced-repetition':
        return <SpacedRepetitionPage notesData={notesData} />;
      case 'todo-calendar':
        return <TodoCalendarPage todosData={todosData} />;
      case 'daily-checklist':
        return <DailyChecklistPage checklistData={checklistData} />;
      default:
        return <SpacedRepetitionPage notesData={notesData} />;
    }
  };
  
  return (
    <div className="app-root">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <MainLayout>{renderPage()}</MainLayout>
    </div>
  );
};

export default App;