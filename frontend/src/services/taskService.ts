import axios from 'axios';
import type { Task, TaskInput, TaskCategory } from '../types/task';

const BASE_URL = 'http://localhost:5000/tasks';

export const getTasks = async (): Promise<Task[]> => {
  const response = await axios.get(`${BASE_URL}/list`);
  return response.data;
};

export const createTask = async (taskData: TaskInput): Promise<Task> => {
  // כאן נוודא שהקטגוריה היא באמת TaskCategory
  const data: TaskInput & { category: TaskCategory } = taskData;
  const response = await axios.post(`${BASE_URL}/create`, data);
  return response.data;
};

export const deleteTask = async (id: string): Promise<{ message: string }> => {
  const response = await axios.delete(`${BASE_URL}/${id}/delete`);
  return response.data;
};

export const updateTask = async (
  id: string,
  data: Partial<TaskInput & { category?: TaskCategory }>
): Promise<Task> => {
  const response = await axios.put(`${BASE_URL}/${id}/update`, data);
  return response.data;
};