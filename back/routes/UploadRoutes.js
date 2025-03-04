import express from 'express';
import { uploadProfileImage, upload } from '../controllers/UploadControllers.js';

const router = express.Router();

// Route pour l'upload de l'image
router.post('/', upload.single('file'), uploadProfileImage);  // Assurez-vous d'utiliser `upload.single('file')` qui correspond au champ du formulaire d'upload

export default router;
