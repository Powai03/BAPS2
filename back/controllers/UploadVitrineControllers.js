import cloudinary from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
dotenv.config();

// Configuration de Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadVitrineImage = async (req, res) => {
    try {
        const { email, publicId } = req.body;
        const file = req.file; // Récupère le fichier envoyé par Multer

        if (!file) {
            return res.status(400).json({ success: false, message: "Aucun fichier reçu." });
        }

        if (!email || !publicId) {
            return res.status(400).json({ success: false, message: "Email ou Public ID manquant." });
        }

        // Vérifier si l'utilisateur existe
        const utilisateur = await prisma.utilisateur.findUnique({
            where: { email }
        });

        if (!utilisateur) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
        }

        const filePath = file.path;
        console.log("Public ID reçu :", publicId);
        console.log("Fichier sauvegardé temporairement :", filePath);

        // Upload du fichier vers Cloudinary
        const result = await cloudinary.v2.uploader.upload(filePath, {
            public_id: `vitrine/${publicId}`,  // Stocke dans un dossier "vitrine"
            resource_type: 'image',
            overwrite: false  // Ne pas écraser les images existantes
        });

        console.log("Upload réussi :", result);

        // Enregistrement du lien de l'image en base de données
        const nouvelleImage = await prisma.image.create({
            data: {
                utilisateurId: utilisateur.id,
                url: result.secure_url,
                type: "vitrine"
            }
        });

        console.log("✅ Image ajoutée à la BDD :", nouvelleImage.url);

        // Supprime le fichier temporaire
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Erreur lors de la suppression du fichier temporaire :", err);
            } else {
                console.log("Fichier temporaire supprimé.");
            }
        });

        return res.status(200).json({
            success: true,
            message: "Image ajoutée avec succès à la vitrine.",
            publicId: result.public_id,
            imageUrl: result.secure_url
        });

    } catch (error) {
        console.error("Erreur lors de l'upload :", error);
        return res.status(500).json({
            success: false,
            message: "Échec de l'upload de l'image.",
            error: error.message
        });
    }
};

export { uploadVitrineImage };
