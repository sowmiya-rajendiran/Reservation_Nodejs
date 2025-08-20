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

const app = express();

//  allow requests from frontend
app.use(cors({
    //   origin: "https://passwordre.netlify.app",
  origin : "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// middleware to handle url encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Routes
app.use('/api/auth' , authRouter);
app.use('/api/users', userRouter);
app.use('/api/restaurants', restRouter);
app.use('/api/reservations', reservationRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/admin' , adminRouter)

// health check route
app.get('/api/health' , (req , res) =>{
    res.status(200).json({
        success : true,
        message : 'API is running',
        timeSteamp : new Date().toISOString()
    })
})

//error handling middleware
app.use(errorHandler);

// handle 404 errors
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

module.exports = app;