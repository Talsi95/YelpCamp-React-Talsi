const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'imgood';

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, user: { id: user._id, username: user.username } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת, נסה שוב מאוחר יותר' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'שם המשתמש לא קיים' });
        };

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'הסיסמא שגויה' });
        };

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאת שרת, נסה שוב מאוחר יותר' });
    }
});

router.post('/logout', (req, res) => {
    res.json({ message: 'התנתקת בהצלחה' });
});

module.exports = router;