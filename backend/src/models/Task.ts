import mongoose, { Schema, Document, Types } from 'mongoose';

export type TaskInput = {
  category: 'Workout' | 'Nutrition' | 'Guitar' | 'Events';
  title: string;
  description: string;
  date: string;
  completed: boolean;
};

export interface ITask extends Document {
  _id: Types.ObjectId;
  category: 'Workout' | 'Nutrition' | 'Guitar' | 'Events';
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

const TaskSchema: Schema<ITask> = new Schema({
  category: { type: String, enum: ['Workout', 'Nutrition', 'Guitar', 'Events'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

export default mongoose.model<ITask>('Task', TaskSchema);
