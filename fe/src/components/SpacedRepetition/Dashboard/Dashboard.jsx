import React from 'react';
import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { StatCard } from './StatCard';
import { getNoteStatus } from '../../../utils';
import './dashboard.css';

export const Dashboard = ({ notes }) => {
  const stats = {
    total: notes.length,
    overdue: notes.filter(n => getNoteStatus(n) === 'overdue').length,
    dueSoon: notes.filter(n => getNoteStatus(n) === 'due-soon').length
  };

  return (
    <div className="dashboard">
      <div className="dashboard-inner">
        <StatCard icon={TrendingUp} label="Tổng số" value={stats.total} className="statcard-bg-gray statcard-text-dark" />
        <StatCard icon={AlertTriangle} label="Quá hạn" value={stats.overdue} className="statcard-bg-red statcard-text-red" />
        <StatCard icon={Clock} label="Sắp tới" value={stats.dueSoon} className="statcard-bg-yellow statcard-text-yellow" />
      </div>
    </div>
  );
};