import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from "./routes/User.routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());
// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err: Error) => console.error('MongoDB connection error:', err));

app.get('/', (req: Request, res: Response) => {
  res.send('API is running with TypeScript!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
