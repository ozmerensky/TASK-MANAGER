import Task, { TaskInput } from '../models/Task';
import { Types } from 'mongoose';

const formatTask = (t: any) => ({
  _id: t._id.toString(),
  title: t.title,
  category: t.category,
  description: t.description || '',
  completed: t.completed,
  date: t.date,
});

export const getTasksService = async () => {
  const tasks = await Task.find();
  return tasks.map(formatTask);
};

export const createTaskService = async (data: TaskInput) => {
  const task = new Task({
    ...data,
    completed: data.completed ?? false,
  });
  await task.save();
  return formatTask(task);
};

export const updateTaskService = async (id: string, data: Partial<TaskInput>) => {
  if (!Types.ObjectId.isValid(id)) return null;

  const task = await Task.findByIdAndUpdate(
    id,
    { ...data },
    { new: true, runValidators: true }
  );

  if (!task) return null;
  return formatTask(task);
};

export const deleteTaskService = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;

  const task = await Task.findByIdAndDelete(id);
  if (!task) return null;
  return formatTask(task);
};

export const getTaskByIdService = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) return null;

  const task = await Task.findById(id);
  if (!task) return null;
  return formatTask(task);
};