const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET || 'imgood';

module.exports = async function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'אין טוקן גישה נדחית' })

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = { _id: user.id };
        next();
    });
    // try {
    //     const decoded = jwt.verify(token, JWT_SECRET);
    //     req.user = await User.findById(decoded.id).select('-password');
    //     if (!req.user) return res.status(404).json({ message: 'משתמש לא נמצא' });
    //     next();
    // } catch (err) {
    //     res.status(403).json({ message: 'גישה נדחתה' });
    // }
}
