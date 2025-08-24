if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // ודא שהפורט הוא הפורט של הלקוח
    credentials: true
}));
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/config', (req, res) => {
    res.json({ maptilerApiKey: process.env.MAPTILER_API_KEY });
});

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

app.use('/api/campgrounds', campgroundRoutes);
app.use('/', reviewRoutes);
app.use('/', userRoutes);

// app.use(express.static(path.join(__dirname, '../client/src')));

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../client/src/index.html'));
// });

mongoose.connect('mongodb://yelpcamp-mongo:27017/yelpcamp');

app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
});
