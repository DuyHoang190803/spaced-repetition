import React from 'react';
import { Button } from '../../common/Button';
import './cardform.css';

export const CardForm = ({ onSubmit, onCancel, newNote, setNewNote }) => (
  <div className="cardform">
    <input type="text" placeholder="Nhập tiêu đề..." value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} className="cardform-input" autoFocus />
    <textarea placeholder="Nội dung (tùy chọn)..." value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} rows="2" className="cardform-input" />


    <div className="cardform-actions">
      <Button onClick={onSubmit} className="cardform-btn">Thêm thẻ</Button>
      <Button onClick={onCancel} variant="ghost" className="cardform-btn">Hủy</Button>
    </div>
  </div>
);