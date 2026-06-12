export interface TaskInput {
  title: string;
  category: string;
  description: string;
  date: string;
}

export interface TaskData extends TaskInput {
  completed?: boolean;
  _id?: string;
}