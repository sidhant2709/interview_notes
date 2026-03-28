import express from 'express';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import colors from 'colors';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config({ path: 'backend/configs/config.env' });

connectDB();

const app = express();

app.use(express.json());

app.use('/api/users', authRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}..`.yellow.bold));
