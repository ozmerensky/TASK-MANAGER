import { createTask, nonExistantTask, taskData, TaskInput } from '../factories/taskFactory';
import { getTasksService, getTaskByIdService, updateTaskService, deleteTaskService } from '../../src/services/taskService';
import { withDatabase } from '../base/baseTest';
import TaskModel from '../../src/models/Task';

withDatabase(() => {
  describe('Task Service Unit Tests', () => {

    describe('createTaskService', () => {
      it('should create a task', async () => {
        const task: TaskInput = taskData.workout;
        const created = await createTask(task);
        expect(created._id.toString()).toBeDefined();
        expect(created.title).toBe(task.title);
      });

      it('should fail validation on invalid data', async () => {
        const invalidTask = { ...taskData.workout, category: 'Invalid' as any };
        await expect(createTask(invalidTask)).rejects.toThrow();
      });

      it('should throw an error (500) when DB fails on create', async () => {
        const saveSpy = jest.spyOn(TaskModel.prototype, 'save' as any).mockRejectedValue(new Error('DB down'));
        await expect(async () => createTask(taskData.workout)).rejects.toThrow('DB down');
        saveSpy.mockRestore();
      });
    });

    describe('getTasksService', () => {
      it('should get all tasks', async () => {
        await createTask(taskData.guitar);
        const tasks = await getTasksService();
        expect(tasks.length).toBe(1);
      });
    });

    describe('getTaskByIdService', () => {
      it('should get task by id', async () => {
        const task = await createTask(taskData.nutrition);
        const found = await getTaskByIdService(task._id.toString());
        expect(found?.title).toBe(task.title);
      });

      it('should return null for non-existent task', async () => {
        const found = await getTaskByIdService(nonExistantTask);
        expect(found).toBeNull();
      });

      it('should return null for invalid ObjectId', async () => {
        const found = await getTaskByIdService('invalid-id');
        expect(found).toBeNull();
      });
    });

    describe('updateTaskService', () => {
      it('should update a task', async () => {
        const task = await createTask(taskData.workout);
        const updated = await updateTaskService(task._id.toString(), { completed: true });
        expect(updated?.completed).toBe(true);
      });

      it('should return null for non-existent task', async () => {
        const updated = await updateTaskService(nonExistantTask, { completed: true });
        expect(updated).toBeNull();
      });

      it('should return null for invalid ObjectId', async () => {
        const updated = await updateTaskService('invalid-id', { completed: true });
        expect(updated).toBeNull();
      });

      it('should throw an error (500) when DB fails on update', async () => {
        const findSpy = jest.spyOn(TaskModel, 'findByIdAndUpdate' as any).mockRejectedValue(new Error('DB fail'));
        await expect(updateTaskService(nonExistantTask, { completed: true })).rejects.toThrow('DB fail');
        findSpy.mockRestore();
      });
    });

    describe('deleteTaskService', () => {
      it('should delete a task', async () => {
        const task = await createTask(taskData.guitar);
        const deleted = await deleteTaskService(task._id.toString());
        expect(deleted?._id.toString()).toBe(task._id.toString());
      });

      it('should return null for non-existent task', async () => {
        const deleted = await deleteTaskService(nonExistantTask);
        expect(deleted).toBeNull();
      });

      it('should return null for invalid ObjectId', async () => {
        const deleted = await deleteTaskService('invalid-id');
        expect(deleted).toBeNull();
      });

      it('should throw an error (500) when DB fails on delete', async () => {
        const delSpy = jest.spyOn(TaskModel, 'findByIdAndDelete' as any).mockRejectedValue(new Error('DB crash'));
        await expect(deleteTaskService(nonExistantTask)).rejects.toThrow('DB crash');
        delSpy.mockRestore();
      });
    });
  })
})
