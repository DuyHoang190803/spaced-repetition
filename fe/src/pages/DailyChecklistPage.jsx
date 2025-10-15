import React from 'react';
import { ChecklistContainer } from '../components/DailyChecklist';

export const DailyChecklistPage = ({ checklistData }) => {
  return <ChecklistContainer checklistData={checklistData} />;
};