import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Récupérer les informations de l'utilisateur
const getUser = async (req, res) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const user = await prisma.utilisateur.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    role: true,
                    nom: true,
                    prenom: true,
                    email: true,
                    telephone: true,
                    adresse: true,
                    numero: true,
                    logo: true,
                    nomEntreprise: true
                },
            });

            if (!user) {
                return res.status(404).json({ message: "Utilisateur non trouvé" });
            }

            res.json(user);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    });
};

// Mettre à jour les informations de l'utilisateur
const updateUser = async (req, res) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            // Récupérer les nouvelles infos depuis la requête
            const { nom, prenom, email, telephone, adresse, numero, nomEntreprise, logo } = req.body;

            const updatedUser = await prisma.utilisateur.update({
                where: { id: decoded.id },
                data: {
                    nom: nom || undefined,
                    prenom: prenom || undefined,
                    email: email || undefined,
                    telephone: telephone || undefined,
                    adresse: adresse || undefined,
                    numero: numero || undefined,
                    nomEntreprise: nomEntreprise || undefined,
                    logo: logo || undefined
                },
                select: {
                    id: true,
                    role: true,
                    nom: true,
                    prenom: true,
                    email: true,
                    telephone: true,
                    adresse: true,
                    numero: true,
                    nomEntreprise: true,
                    logo: true
                }
            });

            res.json({ message: "Profil mis à jour avec succès", user: updatedUser });
        } catch (error) {
            console.error("Erreur lors de la mise à jour :", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    });
};

// Mettre à jour uniquement le logo de l'utilisateur
const updateLogo = async (req, res) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            // Récupérer la nouvelle URL du logo depuis la requête
            const { logo } = req.body;

            // Mise à jour uniquement du logo
            const updatedUser = await prisma.utilisateur.update({
                where: { id: decoded.id },
                data: {
                    logo: logo || undefined,
                },
                select: {
                    logo: true,
                },
            });

            res.json({ message: "Logo mis à jour avec succès", logo: updatedUser.logo });
        } catch (error) {
            console.error("Erreur lors de la mise à jour du logo :", error);
            res.status(500).json({ message: "Erreur serveur" });
        }
    });
};

export { getUser, updateUser, updateLogo };
