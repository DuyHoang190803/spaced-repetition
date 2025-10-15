// src/api/checklist.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

// ==================== API Functions ====================

export const checklistApi = {
  // GET checklist by date
  getByDate: async (date) => {
    const { data } = await apiClient.get(`/checklist?date=${date}`);
    return data;
  },

  // GET today's checklist
  getToday: async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await apiClient.get(`/checklist?date=${today}`);
    return data;
  },

  // POST create checklist item
  create: async (itemData) => {
    const { data } = await apiClient.post('/checklist', itemData);
    return data;
  },

  // PATCH update checklist item
  update: async ({ id, updates }) => {
    const { data } = await apiClient.patch(`/checklist/${id}`, updates);
    return data;
  },

  // PATCH toggle checklist item
  toggle: async (id) => {
    const { data } = await apiClient.patch(`/checklist/${id}/toggle`);
    return data;
  },

  // DELETE checklist item
  delete: async (id) => {
    await apiClient.delete(`/checklist/${id}`);
  },
};

// ==================== React Query Hooks ====================

// Query: Get checklist by date
export const useChecklist = (date, options = {}) => {
  return useQuery({
    queryKey: ['checklist', date],
    queryFn: () => checklistApi.getByDate(date),
    enabled: !!date,
    ...options,
  });
};

// Query: Get today's checklist
export const useTodayChecklist = (options = {}) => {
  const today = new Date().toISOString().split('T')[0];
  return useQuery({
    queryKey: ['checklist', today],
    queryFn: checklistApi.getToday,
    ...options,
  });
};

// Mutation: Create checklist item
export const useCreateChecklistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checklistApi.create,
    onSuccess: (data) => {
      const date = new Date(data.date).toISOString().split('T')[0];
      queryClient.invalidateQueries(['checklist', date]);
    },
  });
};

// Mutation: Update checklist item
export const useUpdateChecklistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checklistApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['checklist']);
    },
  });
};

// Mutation: Toggle checklist item
export const useToggleChecklistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checklistApi.toggle,
    onMutate: async (id) => {
      const today = new Date().toISOString().split('T')[0];
      await queryClient.cancelQueries(['checklist', today]);
      const previousData = queryClient.getQueryData(['checklist', today]);

      // Optimistic update
      queryClient.setQueryData(['checklist', today], (old) =>
        old?.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      );

      return { previousData };
    },
    onError: (err, id, context) => {
      const today = new Date().toISOString().split('T')[0];
      queryClient.setQueryData(['checklist', today], context.previousData);
    },
    onSettled: () => {
      const today = new Date().toISOString().split('T')[0];
      queryClient.invalidateQueries(['checklist', today]);
    },
  });
};

// Mutation: Delete checklist item
export const useDeleteChecklistItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checklistApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['checklist']);
    },
  });
};