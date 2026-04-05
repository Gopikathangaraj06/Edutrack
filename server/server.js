require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://edutrack-alpha-green.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes

// Root Route
app.get("/", (req, res) => {
  res.send("Edutrack Backend is running 🚀");
});

// Health Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Server active");
});
