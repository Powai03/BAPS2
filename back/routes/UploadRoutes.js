import express from 'express';
import upload from '../middleware/multerConfig.js'; 
import { uploadProfileImage } from '../controllers/UploadControllers.js';

const router = express.Router();

// Route pour l'upload de l'image
router.post('/', upload.single('file'), uploadProfileImage); 

export default router;
