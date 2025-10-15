// src/api/todos.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';

// ==================== API Functions ====================

export const todosApi = {
  // GET todos by date range
  getByDateRange: async (startDate, endDate) => {
    const { data } = await apiClient.get(
      `/todos?start=${startDate}&end=${endDate}`
    );
    return data;
  },

  // GET todos by specific date
  getByDate: async (date) => {
    const { data } = await apiClient.get(`/todos?date=${date}`);
    return data;
  },

  // GET all todos
  getAll: async () => {
    const { data } = await apiClient.get('/todos');
    return data;
  },

  // POST create todo
  create: async (todoData) => {
    const { data } = await apiClient.post('/todos', todoData);
    return data;
  },

  // PATCH update todo
  update: async ({ id, updates }) => {
    const { data } = await apiClient.patch(`/todos/${id}`, updates);
    return data;
  },

  // PATCH toggle todo
  toggle: async (id) => {
    const { data } = await apiClient.patch(`/todos/${id}/toggle`);
    return data;
  },

  // DELETE todo
  delete: async (id) => {
    await apiClient.delete(`/todos/${id}`);
  },

  // PATCH move todo to different date
  moveTo: async ({ id, newDate }) => {
    const { data } = await apiClient.patch(`/todos/${id}/move`, { date: newDate });
    return data;
  },
};

// ==================== React Query Hooks ====================

// Query: Get todos by date range
export const useTodos = (startDate, endDate, options = {}) => {
  return useQuery({
    queryKey: ['todos', startDate, endDate],
    queryFn: () => todosApi.getByDateRange(startDate, endDate),
    enabled: !!startDate && !!endDate,
    ...options,
  });
};

// Query: Get todos by specific date
export const useTodosByDate = (date, options = {}) => {
  return useQuery({
    queryKey: ['todos', 'date', date],
    queryFn: () => todosApi.getByDate(date),
    enabled: !!date,
    ...options,
  });
};

// Query: Get all todos
export const useAllTodos = (options = {}) => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: todosApi.getAll,
    ...options,
  });
};

// Mutation: Create todo
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
  });
};

// Mutation: Update todo
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
  });
};

// Mutation: Toggle todo
export const useToggleTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.toggle,
    onMutate: async (id) => {
      await queryClient.cancelQueries(['todos']);
      const previousData = queryClient.getQueryData(['todos']);

      // Optimistic update
      queryClient.setQueryData(['todos'], (old) =>
        old?.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );

      return { previousData };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['todos'], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['todos']);
    },
  });
};

// Mutation: Delete todo
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
  });
};

// Mutation: Move todo to different date
export const useMoveTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.moveTo,
    onSuccess: () => {
      queryClient.invalidateQueries(['todos']);
    },
  });
};