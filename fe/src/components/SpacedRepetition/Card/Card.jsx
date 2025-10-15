// src/components/Card/Card.jsx
import React from 'react';
import { Badge } from '../../common/Badge';
import { useCardLogic } from '../../../hooks/useNotes';
import { formatDateTime } from '../../../utils';
import CardPopover from './CardPopover';
import './Card.css';

/**
 * Card Component - UI Only
 * Tất cả logic đã được gộp vào useNotes hook
 */
export const Card = ({ note, onDragStart, onEdit, onDelete }) => {
  const {
    status,
    expanded,
    popoverStyle,
    fetchedNote,
    cardRef,
    popoverRef,
    handlers,
  } = useCardLogic({ note, onDragStart, onEdit });

  return (
    <div
      ref={cardRef}
      onClick={handlers.handleCardClick}
      onPointerDown={handlers.handlePointerDown}
      onPointerMove={handlers.handlePointerMove}
      onPointerUp={handlers.handlePointerUp}
      onPointerLeave={handlers.handlePointerLeave}
      onDragStart={handlers.handleDragStart}
      className={`card ${expanded ? 'expanded' : 'collapsed'} ${status === 'overdue' ? 'overdue' : ''}`}
    >
      {/* Card Header */}
      {/* <div className="card-header">
        {expanded && status === 'overdue' && <Badge color="red">Quá hạn</Badge>}
      </div> */}

      {/* Card Title */}
      <h4
        className="card-title card-title-toggle"
        role="button"
        tabIndex={0}
        onClick={handlers.handleTitleClick}
        onKeyDown={handlers.handleTitleKeyDown}
        aria-expanded={expanded}
      >
        <span className="card-title-text">{note.title}</span>
        <span className="card-next-inline">{formatDateTime(note.nextReviewTime)}</span>
      </h4>

      {/* Popover */}
      {expanded && (
        <CardPopover
          popoverRef={popoverRef}
          popoverStyle={popoverStyle}
          note={note}
          fetchedNote={fetchedNote}
          status={status}
          onEdit={onEdit}
          onDelete={handlers.handleDelete}
          onClose={handlers.closePopover}
        />
      )}
    </div>
  );
};

const PopoverRow = ({ label, value, className = '' }) => (
  <div className="card-popover-row">
    <div className="card-popover-label">{label}</div>
    <div className={`card-popover-value ${className}`}>{value}</div>
  </div>
);