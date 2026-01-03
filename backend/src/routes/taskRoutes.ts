import express from 'express';
import {
  createTaskController,
  listTasksController,
  getTaskDetailsController,
  updateTaskController,
  deleteTaskController
} from '../controllers/taskController';

const router = express.Router();

router.post('/create', createTaskController);

router.get('/list', listTasksController);

router.get('/:id/details', getTaskDetailsController);

router.put('/:id/update', updateTaskController);

router.delete('/:id/delete', deleteTaskController);

export default router;
