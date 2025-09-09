import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './db/connect.js';
import userRoutes from './routes/route.js';
import courseRoutes from './routes/courseRoutes.js';
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDb();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRoutes);
app.use('/api/courses', courseRoutes); // courses add
app.use("/api/dashboard", dashboardRoutes); //dashboard added here

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
