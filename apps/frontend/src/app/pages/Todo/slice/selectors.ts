import { RootState } from '@/types';

export const selectTodoData = (state: RootState) => state.todo.data;
export const selectTodoIsLoading = (state: RootState) => state.todo.isLoading;
export const selectTodoError = (state: RootState) => state.todo.error;
export const selectEditableTodo = (state: RootState) => state.todo.editableTodo;
