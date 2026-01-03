export enum TaskSource{
    Form = "form",
    Card = "card"
}

export interface TaskInput {
  title: string;
  category: string;
  description: string;
  date: string;
}
