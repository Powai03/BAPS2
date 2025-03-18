import express from 'express';
import { getUser, updateUser } from '../controllers/UserControllers.js';
import { getUserImages } from "../controllers/ImagesControllers.js";
import { getUsersByEtatCreation, validateUser, deleteUser, getModifications , validateModification, rejectModification} from "../controllers/UserControllers.js";

const router = express.Router();

router.get('/', getUser);
router.put('/update', updateUser);
router.get('/images', getUserImages);
router.get("/users", getUsersByEtatCreation);
router.put("/users/validate/:id", validateUser);
router.delete("/users/:id", deleteUser);
router.get("/modifications", getModifications);
router.put("/modifications/validate/:id", validateModification);
router.delete("/modifications/reject/:id", rejectModification);



export default router;
