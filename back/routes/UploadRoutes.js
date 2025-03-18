import express from 'express';
import upload from '../middleware/multerConfig.js'; 
import { uploadProfileImage } from '../controllers/UploadControllers.js';
import { uploadVitrineImage } from '../controllers/UploadVitrineControllers.js';
import { uploadJustificatifFile } from '../controllers/JustificatifControllers.js';

const router = express.Router();

// Route pour l'upload de l'image de profil
router.post('/', upload.single('file'), uploadProfileImage);

// Route pour l'upload de l'image vitrine
router.post('/vitrine', upload.single('file'), (req, res, next) => {
    console.log("🚀 Requête reçue sur /upload/vitrine");
    next();
}, uploadVitrineImage);
router.post('/justificatif', upload.single('file'), uploadJustificatifFile);

export default router;
