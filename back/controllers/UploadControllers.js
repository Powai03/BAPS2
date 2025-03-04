import cloudinary from 'cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

// Configurer Cloudinary avec tes credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuration de Multer pour l'upload du fichier
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Fonction pour uploader une image vers Cloudinary et mettre à jour la base de données
const uploadProfileImage = (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ success: false, message: "Aucun fichier trouvé." });
    }

    // Uploader l'image sur Cloudinary
    cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        async (error, result) => {
            if (error) {
                return res.status(500).json({ success: false, message: error.message });
            }
            
            // L'URL de l'image est dans result.secure_url
            const imageUrl = result.secure_url;

            try {
                // Mettre à jour l'URL du logo dans la base de données (Prisma)
                const updatedUser = await prisma.utilisateur.update({
                    where: { id: req.user.id }, // Utilise l'id de l'utilisateur connecté
                    data: {
                        logo: imageUrl,  // Met à jour la colonne logo avec l'URL de l'image
                    },
                    select: {
                        logo: true,  // On retourne l'URL du logo mis à jour
                    },
                });

                return res.json({
                    success: true,
                    message: 'Image uploadée avec succès',
                    logo: updatedUser.logo,  // Retourne l'URL du logo mis à jour
                });

            } catch (error) {
                console.error('Erreur lors de la mise à jour de l\'image dans la base de données :', error);
                return res.status(500).json({ success: false, message: 'Erreur serveur lors de la mise à jour du profil' });
            }
        }
    ).end(file.buffer);  // Envoie l'image depuis le buffer (Multer)
};

export { uploadProfileImage, upload };
