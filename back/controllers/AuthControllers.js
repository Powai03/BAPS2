import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Fonction d'inscription
const signUp = async (req, res) => {
    const { type, nom, prenom, email, password, telephone, adresse, siren, nom_commerce } = req.body;

    // Vérification du type d'inscription
    if (!type || (type !== "MICRO_ENTREPRISE" && type !== "ENTREPRISE")) {
        return res.status(400).json({ message: "Le type d'utilisateur doit être soit MICRO_ENTREPRISE soit ENTREPRISE." });
    }

    // Validation conditionnelle des champs
    if (type === "MICRO_ENTREPRISE" && (!nom || !prenom)) {
        return res.status(400).json({ message: "Nom et prénom sont obligatoires pour une micro-entreprise." });
    }
    if (type === "ENTREPRISE" && (!siren || !nom_commerce)) {
        return res.status(400).json({ message: "Le SIREN et le nom du commerce sont obligatoires pour une entreprise." });
    }

    if (!email || !password || !adresse) {
        return res.status(400).json({ message: "Email, mot de passe et adresse sont obligatoires." });
    }

    try {
        // Vérifier si l'email est déjà utilisé
        const existingUser = await prisma.utilisateur.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        let role;
        if (type === "MICRO_ENTREPRISE") {
            role = "MICRO_ENTREPRISE";
        } else if (type === "ENTREPRISE") {
            role = "ENTREPRISE";
        } else {
            return res.status(400).json({ message: "Type d'inscription invalide." });
        }

        // Création de l'utilisateur
        const utilisateur = await prisma.utilisateur.create({
            data: {
                role: role,
                nom,
                prenom,
                email,
                password: hashedPassword,
                telephone,
                adresse,
                numero: siren,
                nomEntreprise: nom_commerce
            },
        });

        // Générer un token JWT
        const token = jwt.sign({ id: utilisateur.id, email: utilisateur.email, type }, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.status(201).json({ message: "Inscription réussie", token, userId: utilisateur.id });

    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur interne lors de l'inscription." });
    }
};

// Fonction pour la connexion
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Recherche l'utilisateur
        const user = await prisma.utilisateur.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email." });
        }

        // Vérification du mot de passe
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Mot de passe invalide." });
        }

        // Génération du token
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });

res.json({ token, userId: user.id, role: user.role });


    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur interne lors de la connexion." });
    }
};

export { signUp, login };
