const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const dotenv = require('dotenv');
const {errorHandler} = require('./middlewares/errorHandlerMiddleware');

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://recipe-book-id8a.vercel.app",
  "https://recipe-book-id8a-l5fiz44dz-krishanuroyengs-projects.vercel.app",
  "https://recipe-book-id8a-jyv2qe44e-krishanuroyengs-projects.vercel.app"
];
// Middleware
app.use(express.json());

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization"
};

// Apply CORS before routes
app.use(cors(corsOptions));

// Handle preflight safely (don’t match against broken routes)
app.options('/{*any}', cors(corsOptions));

app.use(helmet());
app.use(rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 100 
}));

app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/mealplans', require('./routes/mealPlanRoutes'));
app.use('/api/shoppinglists', require('./routes/shoppingListRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));
app.use('/api/recipes/:recipeId/comments', require('./routes/commentRoutes'));
// Fallback for unmatched routes
app.all('/{*any}', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Connect DB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(err));

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
