import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

// Fonction pour récupérer les informations de l'utilisateur
const getUser = async (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        console.log(decoded);
        prisma.entreprise.findUnique({
            where: {
                id: decoded.id,
            },
        })
            .then((user) => {
                res.json(user);
                console.log(user);
            })
            .catch((error) => {
                res.json(error);
            });
    });
}

export { getUser };