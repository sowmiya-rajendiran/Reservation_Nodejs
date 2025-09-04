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

//  allow requests from frontend
app.use(cors({
    origin: "https://reservationsyst.netlify.app/api", 
    //   origin : "http://localhost:5173",
  credentials: true,
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());

// middleware to handle url encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Routes
app.use('/auth' , authRouter);
app.use('/users', userRouter);
app.use('/restaurants', restRouter);
app.use('/reservations', reservationRouter);
app.use('/reviews', reviewRouter);
app.use('/recommendations', recommendationsRouter);
app.use('/admin' , adminRouter);

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