const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const authRouter = require('./routes/auth');
const cookieParser = require('cookie-parser');
const reservationRouter = require('./routes/reservationRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const userRouter = require('./routes/usersRouter');
const restRouter = require('./routes/restaurantRoutes');
const recommendationsRouter = require('./routes/recommendationRoutes');
const adminRouter = require('./routes/adminRouter');
const path = require("path");

const app = express();

// Allowed origins (local + production)
const allowedOrigins = [
  "https://reservationsyst.netlify.app", // production frontend
//   "http://localhost:5173" // local frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Handle preflight requests
app.options("*", cors());

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth' , authRouter);
app.use('/api/users', userRouter);
app.use('/api/restaurants', restRouter);
app.use('/api/reservations', reservationRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/admin' , adminRouter);

// Health check
app.get('/api/health' , (req , res) =>{
    res.status(200).json({
        success : true,
        message : 'API is running',
        timeSteamp : new Date().toISOString()
    })
})

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

module.exports = app;