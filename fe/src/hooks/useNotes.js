// src/hooks/useNotes.js
import { useState, useCallback, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  notesApi,
  useNotes as useNotesQuery,
  useNote,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
  useMoveNote,
} from '../api/notesApi';
import { getNoteStatus } from '../utils';

const MOVE_THRESHOLD = 8; // px

/**
 * Hook tổng hợp TẤT CẢ logic xử lý notes
 */
export const useNotes = () => {
  const queryClient = useQueryClient();
  const [draggedNote, setDraggedNote] = useState(null);

  // ==================== React Query ====================
  
  // Fetch all notes via shared hook from api
  const { data: notesResponse, isLoading, error, refetch } = useNotesQuery();

  const notes = notesResponse?.data || [];

  // use prebuilt mutation hooks that encapsulate optimistic updates
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();
  const moveNoteMutation = useMoveNote();

  // ==================== Actions ====================

  const addNote = useCallback(async (noteData) => {
    try {
      await createNoteMutation.mutateAsync(noteData);
      return { success: true };
    } catch (error) {
      console.error('Failed to add note:', error);
      return { success: false, error };
    }
  }, [createNoteMutation]);

  const updateNote = useCallback(async (noteId, updates) => {
    try {
      await updateNoteMutation.mutateAsync({ id: noteId, updates });
      return { success: true };
    } catch (error) {
      console.error('Failed to update note:', error);
      return { success: false, error };
    }
  }, [updateNoteMutation]);

  const deleteNote = useCallback(async (noteId) => {
    try {
      await deleteNoteMutation.mutateAsync(noteId);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete note:', error);
      return { success: false, error };
    }
  }, [deleteNoteMutation]);

  const moveNote = useCallback(async (noteId, columnId) => {
    try {
      await moveNoteMutation.mutateAsync({ id: noteId, columnId });
      return { success: true };
    } catch (error) {
      console.error('Failed to move note:', error);
      return { success: false, error };
    }
  }, [moveNoteMutation]);

  

  // const getNotesByColumn = useCallback((columnId) => {
  //   return notes.filter(note => note.currentPosition === columnId);
  // }, [notes]);

  return {
    // Data
    notes,
    // isLoading,
    // error,

    // Actions
    addNote,
    updateNote,
    deleteNote,
    moveNote,
    // refetch,
    // getNotesByColumn,

    // Drag & drop
    draggedNote,
    setDraggedNote,

    // Loading states
    isCreating: createNoteMutation.isPending,
    isUpdating: updateNoteMutation.isPending,
    isDeleting: deleteNoteMutation.isPending,
    isMoving: moveNoteMutation.isPending,
  };
};

/**
 * Hook chứa logic cho từng Card component
 */
export const useCardLogic = ({ note, onDragStart }) => {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState(null);
  const [fetchedNote, setFetchedNote] = useState(null);
  
  const cardRef = useRef(null);
  const popoverRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const movedRef = useRef(false);
  const suppressedClickRef = useRef(false);

  const status = getNoteStatus(note);
  const noteId = note._id || note.id;

  // Delete mutation
  const deleteNoteMutation = useMutation({
    mutationFn: notesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
    },
  });

  // Fetch chi tiết note khi mở popover
  // Use the exported per-note hook. Enable fetching only when popover is opened.
  const { data: noteResponse, isFetching: isFetchingNote } = useNote(noteId, {
    enabled: !!noteId && expanded,
    // mirror the list defaults so per-note behavior is consistent
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  // Sync react-query response into local fetchedNote state for the popover consumer.
  useEffect(() => {
    if (noteResponse?.data) {
      setFetchedNote(noteResponse.data);
    }
  }, [noteResponse]);

  // Tính vị trí popover
  const calculatePopoverPosition = useCallback(() => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const spaceRight = window.innerWidth - rect.right;
    const width = 360;
    
    let left = rect.right + 8;
    if (spaceRight < width + 16) {
      left = rect.left - width - 8;
    }
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
    const top = rect.top + window.scrollY;

    setPopoverStyle({
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`
    });
  }, []);

  const openPopover = useCallback(() => {
    calculatePopoverPosition();
    setExpanded(true);
  }, [calculatePopoverPosition]);

  const closePopover = useCallback(() => {
    setExpanded(false);
  }, []);

  const toggle = useCallback(() => {
    if (expanded) closePopover();
    else openPopover();
  }, [expanded, openPopover, closePopover]);

  // Pointer handlers
  const handlePointerDown = useCallback((e) => {
    movedRef.current = false;
    suppressedClickRef.current = false;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    if (cardRef.current) cardRef.current.draggable = true;
  }, []);

  const handlePointerMove = useCallback((e) => {
    const start = startPosRef.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.hypot(dx, dy) > MOVE_THRESHOLD) {
      movedRef.current = true;
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    if (cardRef.current) cardRef.current.draggable = false;
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (cardRef.current) cardRef.current.draggable = false;
  }, []);

  const handleDragStart = useCallback((e) => {
    suppressedClickRef.current = true;
    closePopover();
    onDragStart?.(e);
  }, [closePopover, onDragStart]);

  const handleCardClick = useCallback((e) => {
    if (suppressedClickRef.current) {
      suppressedClickRef.current = false;
      return;
    }
    // If click originated from inside the popover, ignore it
    if (popoverRef.current?.contains(e.target)) return;
    toggle();
  }, [toggle]);

  const handleTitleClick = useCallback((e) => {
    if (suppressedClickRef.current) {
      suppressedClickRef.current = false;
      return;
    }
    toggle();
  }, [toggle]);

  const handleTitleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  }, [toggle]);

  const handleDelete = useCallback(async () => {
    if (!noteId) return;
    try {
      await deleteNoteMutation.mutateAsync(noteId);
      closePopover();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }, [noteId, deleteNoteMutation, closePopover]);

  // Click outside để đóng
  useEffect(() => {
    if (!expanded) return;
    const handleClickOutside = (e) => {
      if (cardRef.current?.contains(e.target)) return;
      if (popoverRef.current?.contains(e.target)) return;
      setExpanded(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expanded]);

  return {
    status,
    expanded,
    popoverStyle,
    fetchedNote,
    cardRef,
    popoverRef,
    handlers: {
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
      handlePointerLeave,
      handleDragStart,
      handleCardClick,
      handleTitleClick,
      handleTitleKeyDown,
      handleDelete,
      openPopover,
      closePopover,
      toggle,
    },
  };
};