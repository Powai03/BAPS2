import multer from 'multer';
import path from 'path';

// Configuration de stockage temporaire des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Dossier où enregistrer temporairement
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nom unique
    }
});

const upload = multer({ storage });

export default upload;
