import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import type { Task, TaskInput } from '../types/task';
import styles from './HomePage.module.css';
import { aiSuggestions } from '../mock/aiSuggestions';

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formData, setFormData] = useState<TaskInput>({
    title: '',
    category: 'Workout',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [search, setSearch] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      const created = await createTask(formData);
      setTasks(prev => [...prev, created]);
      resetForm();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleToggleCompleted = async (task: Task) => {
    try {
      const updated = await updateTask(task._id, { completed: !task.completed });
      setTasks(prev => prev.map(t => t._id === task._id ? updated : t));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTaskId(task._id);
    setFormData({
      title: task.title,
      category: task.category,
      description: task.description,
      date: task.date,
      completed: task.completed,
    });
  };

  const handleSave = async () => {
    if (!editingTaskId) return;
    try {
      const updated = await updateTask(editingTaskId, formData);
      setTasks(prev => prev.map(t => t._id === editingTaskId ? updated : t));
      setEditingTaskId(null);
      resetForm();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    resetForm();
  };

  const handleAISuggestCreate = () => {
    const suggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    setFormData({ ...suggestion });
  };

  const handleAISuggestEdit = () => {
    // שומר על completed אם יש
    const suggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    setFormData(prev => ({ ...suggestion, completed: prev.completed ?? false }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Workout',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title} data-cy="main-title">✨ My Tasks 📝</h1>

      {/* AI Suggestion Button (Create) */}
      <div className={styles.aiButtonWrapper}>
        <button className={styles.aiButton} onClick={handleAISuggestCreate} data-cy="suggest-ai-button">
          ✨ Suggest AI Task ✨
        </button>
      </div>

      {/* Form for new task */}
      <div className={styles.form} data-cy="tasks-form">
        <select name="category" value={formData.category} onChange={handleChange} data-cy="task-category">
          <option value="Workout" data-cy="workout-task-option">Workout</option>
          <option value="Nutrition" data-cy="nutrition-task-option">Nutrition</option>
          <option value="Guitar" data-cy="guitar-task-option">Guitar</option>
          <option value="Events" data-cy="events-task-option">Events</option>
        </select>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          data-cy="task-title"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          data-cy="task-description"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          data-cy="task-date"
        />
        <button className={styles.addButton} onClick={handleCreate} data-cy="create-task-button">Add Task</button>
      </div>

      {/* Search */}
      <input
        className={styles.search}
        placeholder="Search tasks..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        data-cy="search-tasks-button"
      />

      {/* Tasks List */}
      <ul className={styles.tasksList} data-cy="tasks-list">
        {filteredTasks.map(task => (
          <li key={task._id} className={styles.taskItem} data-cy="task-item">
            {editingTaskId === task._id ? (
              <div className={styles.inlineEdit}>
                <input
                  className={styles.inlineInput}
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  data-cy="task-edit-title-input"
                />
                <select
                  className={styles.inlineInput}
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  data-cy="task-edit-category-input"
                >
                  <option value="Workout" data-cy="workout-edit-option">Workout</option>
                  <option value="Nutrition" data-cy="nutrition-edit-option">Nutrition</option>
                  <option value="Guitar" data-cy="guitar-edit-option">Guitar</option>
                  <option value="Events" data-cy="events-edit-option">Events</option>
                </select>
                <textarea
                  className={styles.inlineInput}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  data-cy="task-edit-description-input"
                />
                <input
                  className={styles.inlineInput}
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  data-cy="task-edit-date-input"
                />
                <div className={styles.taskButtons}>
                  <button className={styles.editButton} data-cy="task-save-edit-button" onClick={handleSave}>Save</button>
                  <button className={styles.editButton} data-cy="task-cancel-edit-button" onClick={handleCancelEdit}>Cancel</button>
                  <button className={styles.editButton} data-cy="task-suggest-ai-edit-button" onClick={handleAISuggestEdit}>Suggest AI Edit</button>
                </div>
              </div>
            ) : (
              <>
                <div data-cy="task-details-container">
                  <strong data-cy="task-item-title">{task.title} ({task.category}) - {task.completed ? '✅' : '❌'}</strong>
                  <p data-cy="task-item-description">{task.description}</p>
                  <small data-cy="task-item-date">{task.date}</small>
                </div>
                <div className={styles.taskButtons}>
                  <button className={styles.toggleBtn} data-cy="task-toggle-button" onClick={() => handleToggleCompleted(task)}>Toggle</button>
                  <button className={styles.deleteBtn} data-cy="task-delete-button" onClick={() => handleDelete(task._id)}>Delete</button>
                  <button className={styles.editButton} data-cy="task-edit-button" onClick={() => handleEdit(task)}>Edit</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;