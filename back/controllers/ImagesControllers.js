import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const getUserImages = async (req, res) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const images = await prisma.image.findMany({
                where: { utilisateurId: decoded.id }, // 🔥 Filtrer par utilisateur connecté
                select: { id: true, url: true, type: true, createdAt: true }
            });

            console.log("🖼 Images récupérées :", images);
            res.json(images);
        } catch (error) {
            console.error("❌ Erreur lors de la récupération des images :", error);
            res.status(500).json({ message: "Erreur serveur", erreur: error.message });
        }
    });
};

export { getUserImages };
