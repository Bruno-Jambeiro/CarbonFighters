import express from 'express';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import cors from 'cors'

const app = express();




app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

export default app;
