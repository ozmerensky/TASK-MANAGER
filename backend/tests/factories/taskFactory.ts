import Task from '../../src/models/Task';
import { TaskInput } from '../../src/models/Task';

export const taskData: Record<string, TaskInput> = {
  workout: { category: 'Workout', title: 'Push-ups', description: '100 push-ups', date: '2025-09-17', completed: false },
  nutrition: { category: 'Nutrition', title: 'Eat salad', description: 'Healthy lunch', date: '2025-07-01', completed: false },
  guitar: { category: 'Guitar', title: 'Practice scales', description: 'Major scales', date: '2025-11-15', completed: false },
  events: { category: 'Events', title: 'Concert', description: 'Attend Paramore concert', date: '2025-05-27', completed: false },
};

export const createTask = async (task: TaskInput) => {
  const newTask = new Task(task);
  return await newTask.save();
};

export const generateTask = (overrides: Partial<TaskInput> = {}): TaskInput => ({
  category: 'Workout',
  title: 'Default Task',
  description: 'Default description',
  date: '2025-09-01',
  completed: false,
  ...overrides,
});

export { TaskInput };

export const nonExistantTask = '64f00c1234567890abcdef12';

