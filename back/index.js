import express from 'express';
import cors from 'cors';
import router from './router.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS pour autoriser les requêtes venant du frontend
app.use(cors());
app.use(express.json()); // Pour parser les données JSON du body

// Routes
app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
