import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Fonction d'inscription
const signUp = async (req, res) => {
    try {
        console.log("🔹 Données reçues :", req.body); // ✅ Debug

        let {
            accountType, email, password, telephone, adresse, 
            complement_adresse, code_postal, profession, domaine_activite,   
            nom, prenom, nom_entreprise
        } = req.body;

        // Vérification des champs obligatoires
        if (!email || !password || !adresse) {
            return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
        }

        // Vérifier si l'email existe déjà
        const existingUser = await prisma.utilisateur.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Cet email est déjà utilisé." });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Préparation des données pour l'enregistrement
        let utilisateurData = {
            email,
            password: hashedPassword,
            telephone,
            adresse,
            complementAdresse: complement_adresse || null,
            codePostal: code_postal || null,
            profession: profession || null,
            domaineActivite: domaine_activite || null, 
            typeCompte: accountType,
            etatCreation: false,
            etatModification: false,
            role: accountType === "auto-entrepreneur" ? "AUTO_ENTREPRENEUR" : "ENTREPRISE"

        };

        // Gestion du nom/prénom ou nom d'entreprise
        if (accountType === "auto-entrepreneur") {
            utilisateurData.nom = nom;
            utilisateurData.prenom = prenom;
            utilisateurData.nomEntreprise = null;
        } else if (accountType === "entreprise") {
            utilisateurData.nomEntreprise = nom_entreprise;
            utilisateurData.nom = null;
            utilisateurData.prenom = null;
        }

        // Enregistrement en base de données
        const utilisateur = await prisma.utilisateur.create({ data: utilisateurData });

        // Génération du token JWT
        const token = jwt.sign({ id: utilisateur.id, email: utilisateur.email }, process.env.JWT_SECRET, { expiresIn: "12h" });

        res.status(201).json({ message: "Inscription réussie", token, userId: utilisateur.id });

    } catch (error) {
        console.error("❌ Erreur lors de l'inscription :", error);
        res.status(500).json({ message: "Erreur interne lors de l'inscription." });
    }
};

// Fonction de connexion
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

        res.json({ token, userId: user.id, role: user.role, nom: user.nom, nom_commerce: user.nomEntreprise });

    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur interne lors de la connexion." });
    }
};

export { signUp, login };
