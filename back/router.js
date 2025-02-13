import express from 'express';
import authRoutes from './routes/AuthRoutes.js';
import user from './routes/Userroutes.js';

const router = express.Router();

// Regroupement des routes sous /auth
router.use('/auth', authRoutes);
router.use('/user', user);

export default router;
