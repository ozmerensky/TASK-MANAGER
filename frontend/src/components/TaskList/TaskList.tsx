import type { Task } from '../../types/task';
import TaskItem from '../TaskItem/TaskItem';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  onToggleCompleted: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskList = ({ tasks, onToggleCompleted, onDelete }: TaskListProps) => {
  return (
    <ul className={styles.taskList}>
      {tasks.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleCompleted={onToggleCompleted}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TaskList;
