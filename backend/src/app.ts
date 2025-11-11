import express from 'express';
import authRoutes from './routes/auth.routes';
import activityRoutes from './routes/activity.routes';
import cors from 'cors'

const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/activities', activityRoutes);

export default app;
