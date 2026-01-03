export type TaskCategory = 'Workout' | 'Guitar' | 'Nutrition' | 'Events';

export interface Task {
  _id: string;
  title: string;
  category: TaskCategory;
  description: string;
  completed: boolean;
  date: string
}

export interface TaskInput {
  title: string;
  category: TaskCategory;
  completed?: boolean;
  description: string;
  date: string;
}
