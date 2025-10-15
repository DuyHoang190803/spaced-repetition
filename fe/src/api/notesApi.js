// src/api/notes.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

// ==================== API Functions ====================

export const notesApi = {
  // GET all notes
  getAll: async () => {
    const { data } = await apiClient.get('/notes');
    return data;
  },

  // GET notes by column
  getByColumn: async (columnId) => {
    const { data } = await apiClient.get(`/notes?column=${columnId}`);
    return data;
  },

  // GET single note
  getById: async (id) => {
    const { data } = await apiClient.get(`/notes/${id}`);
    return data;
  },

  // POST create note
  create: async (noteData) => {
    const { data } = await apiClient.post('/notes', noteData);
    return data;
  },

  // PATCH update note
  update: async ({ id, updates }) => {
    const { data } = await apiClient.patch(`/notes/${id}`, updates);
    return data;
  },

  // DELETE note
  delete: async (id) => {
    await apiClient.delete(`/notes/${id}`);
  },

  // PATCH move note to column
  moveToColumn: async ({ id, columnId }) => {
    const { data } = await apiClient.patch(`/notes/${id}/move`, { columnId });
    return data;
  },
};

// ==================== React Query Hooks ====================

// Query: Get all notes
export const useNotes = (options = {}) => {
  // Default behaviour:
  // - staleTime: 10 minutes (1000 * 60 * 10) so data is considered fresh for 10m
  // - refetchOnWindowFocus: false so switching back to the tab won't trigger a refetch
  // Callers can override any of these via the `options` param.
  const defaults = {
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  };

  return useQuery({
    queryKey: ['notes'],
    queryFn: notesApi.getAll,
    ...defaults,
    ...options,
  });
};

// Query: Get notes by column
export const useNotesByColumn = (columnId, options = {}) => {
  return useQuery({
    queryKey: ['notes', 'column', columnId],
    queryFn: () => notesApi.getByColumn(columnId),
    enabled: !!columnId,
    ...options,
  });
};

// Query: Get single note
export const useNote = (id, options = {}) => {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: () => notesApi.getById(id),
    enabled: !!id,
    ...options,
  });
};

// Mutation: Create note
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
    },
    onError: (error) => {
      console.error('Failed to create note:', error);
    },
  });
};

// Mutation: Update note
export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.update,
    onMutate: async ({ id, updates }) => {
      console.log(updates);
      
      // Optimistic update
      await queryClient.cancelQueries(['notes']);
      const previousNotes = queryClient.getQueryData(['notes']);

      queryClient.setQueryData(['notes'], (old) => ({
        ...old,
        data: old?.data?.map((note) => ((note._id === id || note.id === id) ? { ...note, ...updates } : note))
      }));

      return { previousNotes };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['notes'], context.previousNotes);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['notes']);
    },
  });
};

// Mutation: Delete note
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.delete,
    onMutate: async (id) => {
      await queryClient.cancelQueries(['notes']);
      const previous = queryClient.getQueryData(['notes']);
      queryClient.setQueryData(['notes'], (old) => ({ ...old, data: old?.data?.filter(n => (n._id || n.id) !== id) }));
      return { previous };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['notes'], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['notes']);
    },
  });
};

// Mutation: Move note to column (for drag & drop)
export const useMoveNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notesApi.moveToColumn,
    onMutate: async ({ id, columnId }) => {
      await queryClient.cancelQueries(['notes']);
      const previousNotes = queryClient.getQueryData(['notes']);
      queryClient.setQueryData(['notes'], (old) => ({
        ...old,
        data: old?.data?.map((note) => ((note._id === id || note.id === id) ? { ...note, currentPosition: columnId } : note))
      }));

      return { previousNotes };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['notes'], context.previousNotes);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['notes']);
    },
  });
};