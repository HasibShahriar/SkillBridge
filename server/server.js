import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import route from './routes/route.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import opportunityRoutes from './routes/opportunityRoutes.js';
// Load env variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/user', route);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/opportunities', opportunityRoutes);

// MongoDB connection
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});
