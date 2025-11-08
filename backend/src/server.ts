import app from './app';
import dotenv from 'dotenv';

// Load the correct .env file based on environment
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

dotenv.config({
    path: envFile,
    quiet: true
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
