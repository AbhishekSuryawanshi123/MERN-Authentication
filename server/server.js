import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ['http://localhost:5173']

app.use(cors({origin: allowedOrigins,credentials: true}));
app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);


//API Routes
app.get('/', (req, res) => {
    res.send('Ram Ram!');
});

app.use('/api/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});