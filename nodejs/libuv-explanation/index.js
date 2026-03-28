import express from 'express';
import connectDB from './config/db.js';
import userRoutes from './routes/user.route.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', userRoutes);

app.listen(PORT, () => {
  connectDB()
  console.log(`Server is running on http://localhost:${PORT}`);
});
