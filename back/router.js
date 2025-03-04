import express from 'express';
import authRoutes from './routes/AuthRoutes.js';
import userRoutes from './routes/UserRoutes.js';
import uploadRoutes from './routes/UploadRoutes.js';

const router = express.Router();

// Regroupement des routes sous /auth
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/upload', uploadRoutes);

export default router;
