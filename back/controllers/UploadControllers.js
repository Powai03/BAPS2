import cloudinary from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Configuration de Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadProfileImage = async (req, res) => {
    try {
        const publicId = req.body.publicId;
        const file = req.file; // Récupère le fichier envoyé par Multer

        if (!file) {
            return res.status(400).json({ success: false, message: "Aucun fichier reçu." });
        }

        if (!publicId) {
            return res.status(400).json({ success: false, message: "Public ID manquant." });
        }

        const filePath = file.path;
        console.log("Public ID reçu :", publicId);
        console.log("Fichier sauvegardé temporairement :", filePath);

        // Upload du fichier vers Cloudinary en mode **asynchrone**
        const result = await cloudinary.v2.uploader.upload(filePath, {
            public_id: publicId,  
            resource_type: 'image',
            overwrite: true  
        });

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

    } catch (error) {
        console.error("Erreur Cloudinary :", error);
        return res.status(500).json({
            success: false,
            message: "Échec de l'upload de l'image.",
            error: error.message
        });
    }
};

export { uploadProfileImage };
