import cloudinary from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadJustificatifFile = async (req, res) => {
    try {
        const { publicId, email, type } = req.body;
        const file = req.file;

        if (!file || !publicId || !email || !type) {
            return res.status(400).json({ success: false, message: "Données manquantes." });
        }

        const result = await cloudinary.v2.uploader.upload(file.path, {
            public_id: publicId,
            resource_type: 'image',
            overwrite: true
        });

        await prisma.utilisateur.update({
            where: { email },
            data: { [type]: result.secure_url }
        });

        fs.unlink(file.path, (err) => {
            if (err) console.error("Erreur suppression fichier :", err);
        });

        return res.status(200).json({
            success: true,
            message: "Fichier uploadé avec succès.",
            imageUrl: result.secure_url
        });

    } catch (error) {
        console.error("Erreur Cloudinary :", error);
        return res.status(500).json({ success: false, message: "Échec de l'upload.", error: error.message });
    }
};

export { uploadJustificatifFile };
