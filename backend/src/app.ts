import express from 'express';
import authRoutes from './routes/auth.routes';
import groupRouthes from './routes/group.routes';
import actionRoutes from './routes/action.routes';
import badgeRoutes from './routes/badge.routes';
import actionsRoutes from './routes/actions.routes';
import userRoutes from './routes/user.routes';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables only if not in GitHub Actions test mode
if (process.env.NODE_ENV !== 'github-actions') {
    const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
    dotenv.config({ path: envFile, quiet: true });
}

const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}))

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/groups', groupRouthes);
app.use('/actions', actionRoutes);
app.use('/badges', badgeRoutes);
app.use('/actions', actionsRoutes);
app.use('/user', userRoutes);

export default app;
