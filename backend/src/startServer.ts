import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is working!');
});

import taskRoutes from './routes/taskRoutes';
app.use('/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`connected to the MongoDB ${process.env.MONGO_URI}`);
    });
  })
  .catch(err => console.error(err));
