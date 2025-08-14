import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import mainRoutes from "./routes";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swaggers';
import { errorHandler } from './middlewares/errorHandler.middleware';
import cron from 'node-cron';
import { EventService } from './services';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;
const eventService = new EventService();

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

// cron.schedule('*/2 * * * *', async () => {
//   await eventService.updateEventStatus();
// });
