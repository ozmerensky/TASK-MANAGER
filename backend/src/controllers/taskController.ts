import { Request, Response } from 'express';
import { TaskInput } from '../models/Task';
import {
  createTaskService,
  getTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService
} from '../services/taskService';

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const task = await createTaskService(req.body as TaskInput);
    res.status(201).json(task);
  } catch (err: any) {
    res.status(400).json({ error: 'Invalid data', details: err.message });
  }
};

export const listTasksController = async (_req: Request, res: Response) => {
  try {
    const tasks = await getTasksService();
    res.status(200).json(tasks);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

export const getTaskDetailsController = async (req: Request, res: Response) => {
  try {
    const task = await getTaskByIdService(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const updated = await updateTaskService(req.params.id, req.body as Partial<TaskInput>);
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(400).json({ error: 'Invalid data', details: err.message });
  }
};

export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const deleted = await deleteTaskService(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ message: 'Task deleted' });
  } catch (err: any) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};