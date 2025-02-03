import express from 'express';
import authRoutes from './routes/AuthRoutes.js';

const router = express.Router();

// Regroupement des routes sous /auth
router.use('/auth', authRoutes);

export default router;
