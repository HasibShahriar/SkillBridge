import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: "Access denied. No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(404).json({ message: "Invalid token. User not found" });

        req.user = {id: user._id};
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};