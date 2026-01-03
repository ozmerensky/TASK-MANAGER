import type { Task } from '../../types/task';
import styles from './TaskItem.module.css';

interface TaskItemProps {
  task: Task;
  onToggleCompleted: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onToggleCompleted, onDelete }: TaskItemProps) => {
  return (
    <li className={styles.taskItem}>
      <span
        className={task.completed ? styles.completed : ''}
        onClick={() => onToggleCompleted(task._id)}
      >
        {task.title}
      </span>
      <button onClick={() => onDelete(task._id)}>Delete</button>
    </li>
  );
};

export default TaskItem;
