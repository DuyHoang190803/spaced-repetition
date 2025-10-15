import React from 'react';
import { Badge } from '../../common/Badge';
import { formatDateTime } from '../../../utils';
import './Card.css';

export const CardPopover = ({ popoverRef, popoverStyle, note, fetchedNote, status, onEdit, onDelete, onClose }) => {
  const displayNote = fetchedNote || note;

  const handleContainerMouseDown = (e) => {
    // If clicked element is the close or delete button, allow its handler to run
    const isCloseBtn = e.target.closest && e.target.closest('.card-popover-close');
    const isDeleteBtn = e.target.closest && e.target.closest('.card-popover-btn.delete');
    if (isCloseBtn || isDeleteBtn) {
      // let button handlers handle stopping propagation if needed
      return;
    }
    // Prevent clicks inside popover from bubbling up to the Card's onClick
    e.stopPropagation();
  };
                                                                                                                                                                                                                                                                                                                                            
  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit?.(note);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.();
  };

  const handleCloseClick = (e) => {
    e.stopPropagation();
    onClose?.();
  };

  return (
    <div
      ref={popoverRef}
      className="card-popover"
      style={popoverStyle}
      role="dialog"
      aria-label={`Chi tiết ${note.title}`}
      onMouseDown={handleContainerMouseDown}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
    >
      <div className="card-popover-header">
        <div className="card-popover-badge-and-title">
          {status === 'overdue' && <Badge color="red">Quá hạn</Badge>}
          <h3 className="card-popover-title">{displayNote.title}</h3>
        </div>
        <div className="card-popover-actions">
          <button
            className="card-popover-btn"
            onClick={handleEditClick}
            aria-label="Sửa"
          >
            Sửa
          </button>
          <button
            className="card-popover-btn delete"
            onClick={handleDeleteClick}
            aria-label="Xóa"
          >
            Xóa
          </button>
          <button
            className="card-popover-close"
            onClick={handleCloseClick}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
      </div>

      <div className="card-popover-body">
        <div className="card-popover-row">
          <div className="card-popover-label">Lần ôn lại thứ:</div>
          <div className="card-popover-value">{displayNote.reviewCount}</div>
        </div>

        {displayNote.content && (
          <div className="card-popover-row">
            <div className="card-popover-label">Nội dung:</div>
            <div className="card-popover-value card-popover-content">{displayNote.content}</div>
          </div>
        )}

        <div className="card-popover-row">
          <div className="card-popover-label">Ngày tạo:</div>
          <div className="card-popover-value">{formatDateTime(displayNote.createdAt || displayNote.created)}</div>
        </div>

        <div className="card-popover-row">
          <div className="card-popover-label">Nên ôn lại vào:</div>
          <div className="card-popover-value">{formatDateTime(displayNote.nextReviewTime)}</div>
        </div>
      </div>
    </div>
  );
};

export default CardPopover;
