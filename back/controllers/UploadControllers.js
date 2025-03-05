import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { stringify } from 'querystring';

dotenv.config();

// Configuration de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadProfileImage = (req, res) => {
    const publicId = req.body.publicId;
    const file = req.file; // Le fichier temporaire stocké par Multer

    if (!file) {
        return res.status(400).json({ success: false, message: "Aucun fichier reçu." });
    }

    const filePath = file.path; // Récupération du chemin temporaire
    console.log("Public ID reçu :", publicId);
    console.log("Fichier sauvegardé temporairement :", filePath);

    if (!publicId) {
        return res.status(400).json({ success: false, message: "Public ID manquant." });
    }

    // Upload du fichier vers Cloudinary
    cloudinary.uploader.upload(
        filePath,
        { 
            public_id: stringify(publicId),  
            resource_type: 'auto',
            overwrite: true  
        },
        (error, result) => {
            if (error) {
                console.error("Erreur Cloudinary :", error);
                return res.status(500).json({
                    success: false,
                    message: "Échec de l'upload de l'image.",
                    error: error.message
                });
            }

            console.log("Upload réussi :", result);

            // Supprime le fichier temporaire après l'upload
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Erreur lors de la suppression du fichier temporaire :", err);
                } else {
                    console.log("Fichier temporaire supprimé.");
                }
            });

            return res.status(200).json({
                success: true,
                message: "Image uploadée avec succès.",
                publicId: result.public_id,  
                imageUrl: result.secure_url  
            });
        }
    );
};

export { uploadProfileImage };
