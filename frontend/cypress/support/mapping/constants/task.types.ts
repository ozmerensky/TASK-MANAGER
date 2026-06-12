export interface TaskInput {
  title: string;
  category: string;
  description: string;
  date: string;
}

// TaskData יורש אוטומטית את כל השדות של TaskInput ומוסיף את השדות החדשים
export interface TaskData extends TaskInput {
  completed?: boolean;
  _id?: string; // הוספתי כבונוס, כי ראינו שה-API מחזיר גם מזהה
}