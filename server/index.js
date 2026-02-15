const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan'); // ✅ add this

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
    const msg = `[REQUEST] ${new Date().toISOString()} ${req.method} ${req.originalUrl}\n`;
    console.log(msg.trim());
    try { require('fs').appendFileSync('server_requests.log', msg); } catch (e) { }
    next();
});

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        return callback(null, true); // Allow all origins for tunnel testing
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/theleoroyalhotel')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
const authRoute = require('./routes/auth');
const roomsRoute = require('./routes/rooms');
const hallsRoute = require('./routes/halls');
const foodRoute = require('./routes/food');
const bookingRoute = require('./routes/bookings');

app.use("/api/auth", authRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/halls", hallsRoute);
app.use("/api/food", foodRoute);
app.use("/api/bookings", bookingRoute);

// Error Handling Middleware
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
