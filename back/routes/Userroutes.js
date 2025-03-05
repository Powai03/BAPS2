import express from 'express';
import { getUser, updateUser } from '../controllers/UserControllers.js';

const router = express.Router();

router.get('/', getUser);
router.put('/update', updateUser);

export default router;
