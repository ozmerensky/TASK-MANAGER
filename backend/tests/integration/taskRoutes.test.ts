import { taskData, createTask, TaskInput, nonExistantTask } from '../factories/taskFactory';
import { taskApi } from '../helpers/taskApi';
import TaskModel from '../../src/models/Task';
import { withDatabase } from '../base/baseTest';

withDatabase(() => {
  describe('Task Routes Integration Tests', () => {

    it('POST /tasks/create creates a task', async () => {
      const task: TaskInput = taskData.nutrition;
      const res = await taskApi.create(task);
      expect(res.status).toBe(201);
      expect(res.body.title).toBe(task.title);
    });

    it('POST /tasks/create fails with missing title', async () => {
  const res = await taskApi.create({ category: 'Workout', date: '2025-09-17' } as any);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid data');
    });

    it('GET /tasks/list returns tasks', async () => {
      await createTask(taskData.guitar);
      const res = await taskApi.list();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('GET /tasks/:id/details returns the correct task', async () => {
      const task = await createTask(taskData.events);
      const res = await taskApi.details(task._id.toString());
      expect(res.status).toBe(200);
      expect(res.body.title).toBe(task.title);
    });

    it('GET /tasks/:id/details returns 404 for non-existent task', async () => {
      const res = await taskApi.details(nonExistantTask);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Task not found');
    });

    it('PUT /tasks/:id/update updates a task', async () => {
      const task = await createTask(taskData.workout);
      const res = await taskApi.update(task._id.toString(), { completed: true });
      expect(res.status).toBe(200);
      expect(res.body.completed).toBe(true);
    });

    it('PUT /tasks/:id/update returns 404 for non-existent task', async () => {
      const res = await taskApi.update(nonExistantTask, { completed: true });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Task not found');
    });

    it('PUT /tasks/:id/update fails with invalid data', async () => {
      const task = await createTask(taskData.workout);
      const res = await taskApi.update(task._id.toString(), { category: 'Invalid' } as any);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid data');
    });

    it('DELETE /tasks/:id/delete deletes a task', async () => {
      const task = await createTask(taskData.workout);
      const res = await taskApi.delete(task._id.toString());
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Task deleted');
    });

    it('DELETE /tasks/:id/delete returns 404 for non-existent task', async () => {
      const res = await taskApi.delete(nonExistantTask);
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Task not found');
    });

    it('GET /tasks/list returns all tasks of different categories', async () => {
      await createTask(taskData.workout);
      await createTask(taskData.guitar);
      await createTask(taskData.nutrition);
      await createTask(taskData.events);

      const res = await taskApi.list();
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(4);
      const categories = res.body.map((t: any) => t.category);
      expect(categories).toContain(taskData.workout.category);
      expect(categories).toContain(taskData.guitar.category);
      expect(categories).toContain(taskData.nutrition.category);
      expect(categories).toContain(taskData.events.category);
    });

    it('GET /tasks/list returns 500 when DB fails', async () => {
      const spy = jest.spyOn(TaskModel, 'find' as any).mockRejectedValue(new Error('DB down'));
      const res = await taskApi.list();
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error', 'Server error');
      spy.mockRestore();
    });

    it('GET /tasks/:id/details returns 500 when DB fails', async () => {
      const task = await createTask(taskData.events);
      const spy = jest.spyOn(TaskModel, 'findById' as any).mockRejectedValue(new Error('DB fail'));
      const res = await taskApi.details(task._id.toString());
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error', 'Server error');
      spy.mockRestore();
    });

    it('DELETE /tasks/:id/delete returns 500 when DB fails', async () => {
      const task = await createTask(taskData.nutrition);
      const spy = jest.spyOn(TaskModel, 'findByIdAndDelete' as any).mockRejectedValue(new Error('DB crash'));
      const res = await taskApi.delete(task._id.toString());
      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error', 'Server error');
      spy.mockRestore();
    });

  });
});
