import express from 'express';
import { signUp, login } from '../controllers/AuthControllers.js';

const router = express.Router();

// Route d'inscription
router.post('/signup', signUp);

// Route de connexion
router.post('/login', login);

export default router;
