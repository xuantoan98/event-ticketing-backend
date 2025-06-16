import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import mainRoutes from "./routes";
import { errorHandler } from './middlewares/error.middleware';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swaggers';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Route api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api', mainRoutes);

// Error Handler
app.use(errorHandler);

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
