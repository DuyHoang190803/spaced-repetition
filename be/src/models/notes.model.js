import mongoose from 'mongoose';

export const columns = ['0m', '20m', '1h', '9h', '1d', '3d', '7d', '16d', '30d', '60d', '90d', '180d'];

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: { type: String },
  currentPosition: { type: String, enum: columns, default: '0m' },
  reviewCount: { type: Number, default: 0 },
  nextReviewTime: { type: Date, default: null },
  createdAt: { type: Date, default: () => new Date() },
});

// Indexes similar to previous implementation
NoteSchema.index({ currentPosition: 1 }, { name: 'idx_currentPosition' });
NoteSchema.index({ nextReviewTime: 1 }, { name: 'idx_nextReviewTime' });
NoteSchema.index({ createdAt: -1 }, { name: 'idx_createdAt' });
NoteSchema.index({ title: 'text', content: 'text' }, { name: 'idx_text_title_content' });


const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);
export default Note;
