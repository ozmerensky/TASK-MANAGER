import request from 'supertest';
import app from '../../src/app';
import { TaskInput } from '../factories/taskFactory';

export const taskApi = {
  create: (task: TaskInput) => request(app).post('/tasks/create').send(task),
  list: () => request(app).get('/tasks/list'),
  details: (id: string) => request(app).get(`/tasks/${id}/details`),
  update: (id: string, data: Partial<TaskInput>) => request(app).put(`/tasks/${id}/update`).send(data),
  delete: (id: string) => request(app).delete(`/tasks/${id}/delete`)
};
