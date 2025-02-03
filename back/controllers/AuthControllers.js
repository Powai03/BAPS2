import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Fonction pour l'inscription
const signUp = async (req, res) => {
    const { nom, email, password, numero, telephone, description, adresse, siteWeb } = req.body;

    // Validation des champs nécessaires
    if (!nom || !email || !password || !numero || !telephone || !description || !adresse || !siteWeb) {
        return res.status(400).json({ message: "Tous les champs doivent être remplis." });
    }

    try {
        // Vérification si l'email est déjà utilisé
        const existingEntreprise = await prisma.entreprise.findUnique({
            where: { email },
        });
        if (existingEntreprise) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // Hashing du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'entreprise
        const entreprise = await prisma.entreprise.create({
            data: {
                email,
                nom,
                password: hashedPassword,
                numero,
                telephone,
                description,
                adresse,
                siteWeb,
            },
        });

        // Retourner l'entreprise créée
        res.status(201).json(entreprise);
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur interne lors de la création de l'entreprise." });
    }
};

// Fonction pour la connexion
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.entreprise.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé avec cet email.' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Mot de passe invalide.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '12h' });
        res.json({ token, userId: user.id });

    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur interne lors de la connexion." });
    }
}

export { signUp, login };
