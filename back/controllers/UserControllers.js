import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid"; // Importer uuid pour générer un id manuellement


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
                    nomEntreprise: true,
                    siteWeb: true,
                    domaineActivite: true,
                    profession: true,
                    codePostal: true,
                    complementAdresse: true,
                    description: true,
                    pieceIdentite: true,
                    justificatif: true,
                    typeCompte: true,
                    etatCreation: true
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
            console.log("🔹 Token décodé :", decoded);

            const {
                nom,
                prenom,
                nomEntreprise,
                email,
                password,
                telephone,
                adresse,
                complementAdresse,
                codePostal,
                siteWeb,
                description
            } = req.body;

            console.log("📩 Données reçues :", req.body);

            // Vérifier si une modification est déjà en attente
            const existingModification = await prisma.modification.findFirst({
                where: {
                    utilisateurId: decoded.id, // ✅ Correction ici
                    etatValidation: false,
                },
            });

            console.log("🔍 Modification existante :", existingModification);

            if (existingModification) {
                return res.status(400).json({ message: "Une modification est déjà en attente de validation." });
            }

            // Insérer la nouvelle modification
            const modification = await prisma.modification.create({
                data: {
                    id: uuidv4(),
                    utilisateurId: decoded.id, // ✅ Correction ici
                    nom: nom || null,
                    prenom: prenom || null,
                    nomEntreprise: nomEntreprise || null,
                    email: email || null,
                    password: password || null,
                    telephone: telephone || null,
                    adresse: adresse || null,
                    complementAdresse: complementAdresse || null,
                    codePostal: codePostal || null,
                    siteWeb: siteWeb || null,
                    description: description || null,

                    etatValidation: false, 
                },
            });

            console.log("✅ Modification créée :", modification);

            res.json({ message: "Votre modification a été soumise pour validation.", modification });
        } catch (error) {
            console.error("❌ Erreur lors de la soumission :", error);
            res.status(500).json({ message: "Erreur serveur", erreur: error.message });
        }
    });
};

// ✅ Récupérer les utilisateurs selon leur état de création
const getUsersByEtatCreation = async (req, res) => {
    try {
        const { etatCreation } = req.query; // Récupère la valeur (true/false) depuis l'URL
        const users = await prisma.utilisateur.findMany({
            where: { etatCreation: etatCreation === "true" }, // Convertit en booléen
            select: { id: true,numero:true, nomEntreprise:true, nom: true, prenom: true, email: true, role: true, etatCreation: true, justificatif: true, pieceIdentite: true }
        });

        res.json(users);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ✅ Valider un utilisateur (passer etatCreation à true)
const validateUser = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.utilisateur.update({ where: { id }, data: { etatCreation: true } });
        res.json({ message: "Utilisateur validé avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la validation :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ❌ Supprimer un utilisateur
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.utilisateur.delete({ where: { id } });
        res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const getModifications = async (req, res) => {
    try {
        const modifications = await prisma.modification.findMany({
            where: { etatValidation: false },
            include: { utilisateur: { select: { nom: true, prenom: true, email: true } } }
        });

        res.json(modifications);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des modifications :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
const validateModification = async (req, res) => {
    const { id } = req.params;

    try {
        const modification = await prisma.modification.findUnique({ where: { id } });

        if (!modification) {
            return res.status(404).json({ message: "Modification non trouvée" });
        }

        await prisma.utilisateur.update({
            where: { id: modification.utilisateurId },
            data: {
                nom: modification.nom ?? undefined,
                prenom: modification.prenom ?? undefined,
                nomEntreprise: modification.nomEntreprise ?? undefined,
                email: modification.email ?? undefined,
                password: modification.password ?? undefined,
                telephone: modification.telephone ?? undefined,
                adresse: modification.adresse ?? undefined,
                complementAdresse: modification.complementAdresse ?? undefined,
                codePostal: modification.codePostal ?? undefined,
                siteWeb: modification.siteWeb ?? undefined,
                description: modification.description ?? undefined,
            },
        });

        await prisma.modification.delete({ where: { id } });

        res.json({ message: "Modification validée et appliquée avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la validation :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const rejectModification = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.modification.delete({ where: { id } });
        res.json({ message: "Modification refusée et supprimée" });
    } catch (error) {
        console.error("❌ Erreur lors du refus :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

const getAllEntreprisesWithImages = async (req, res) => {
    try {
        const entreprises = await prisma.utilisateur.findMany({
            where: { etatCreation: true, role: { in: ["ENTREPRISE", "AUTO_ENTREPRENEUR", "ADMIN"] } },
            select: {
                id: true,
                nomEntreprise: true,
                nom: true,
                prenom: true,
                email: true,
                telephone: true,
                adresse: true,
                logo: true,
                siteWeb: true,
                description: true,
                profession: true,
                domaineActivite: true,
                images: { select: { url: true } }, // Récupérer toutes les images associées
            },
        });

        res.json(entreprises);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des entreprises :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


export { getAllEntreprisesWithImages, getUser, updateUser , getUsersByEtatCreation, validateUser, deleteUser, getModifications, validateModification, rejectModification };


