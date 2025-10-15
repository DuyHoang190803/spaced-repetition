import express from 'express';
import * as service from '../services/notes.service.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const notes = await service.listNotes();
    // return lightweight list for the board view (only fields needed)
    const payload = notes.map(n => ({
      _id: n._id.toString(),
      title: n.title,
      currentPosition: n.currentPosition,
      nextReviewTime: n.nextReviewTime
    }));
    return res.status(200).json({ status: 'ok', data: payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    const created = await service.createNote({ title, content });
    return res.status(201).json({ status: 'ok', data: { ...created, _id: created._id.toString() } });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ status: 'error', message: err.message || 'Server error' });
  }
});

router.patch('/', async (req, res) => {
  try {
    const { id, targetPosition } = req.body;
    const updated = await service.moveNote({ id, targetPosition });
    return res.status(200).json({ status: 'ok', data: { ...updated, _id: updated._id.toString() } });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ status: 'error', message: err.message || 'Error' });
  }
});

// Generic update by id (PATCH /api/notes/:id)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};
    const updated = await service.updateNote(id, updates);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Not found' });
    return res.status(200).json({ status: 'ok', data: { ...updated, _id: updated._id.toString() } });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ status: 'error', message: err.message || 'Error' });
  }
});

// Move endpoint to match frontend: PATCH /api/notes/:id/move
router.patch('/:id/move', async (req, res) => {
  try {
    const { id } = req.params;
    const { columnId } = req.body;
    const updated = await service.moveNote({ id, targetPosition: columnId });
    return res.status(200).json({ status: 'ok', data: { ...updated, _id: updated._id.toString() } });
  } catch (err) {
    console.error(err);
    if (err.message && err.message.includes('not')) return res.status(404).json({ status: 'error', message: 'Not found' });
    return res.status(400).json({ status: 'error', message: err.message || 'Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const note = await service.getNoteById(id);
    if (!note) return res.status(404).json({ status: 'error', message: 'Not found' });
    return res.status(200).json({ status: 'ok', data: { ...note, _id: note._id.toString() } });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ status: 'error', message: err.message || 'Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await service.deleteNote(id);
    if (!ok) return res.status(404).json({ status: 'error', message: 'Not found' });
    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ status: 'error', message: err.message || 'Error' });
  }
});

export default router;
