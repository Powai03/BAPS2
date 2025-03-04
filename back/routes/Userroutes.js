import express from 'express';
import { getUser, updateUser, updateLogo } from '../controllers/UserControllers.js';

const router = express.Router();

router.get('/', getUser);
router.put('/update', updateUser);
router.put('/updateProfileImage', updateLogo);  // Endpoint pour mettre à jour le logo

export default router;
