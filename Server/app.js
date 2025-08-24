if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/config', (req, res) => {
    res.json({ maptilerApiKey: process.env.MAPTILER_API_KEY });
});

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

app.use('/api/campgrounds', campgroundRoutes);
app.use('/api', reviewRoutes);
app.use('/api', userRoutes);

app.use(express.static(path.join(__dirname, '../Client/dist')));

app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../Client/dist/index.html'));
});

mongoose.connect('mongodb://yelpcamp-mongo:27017/yelpcamp');

app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
});
