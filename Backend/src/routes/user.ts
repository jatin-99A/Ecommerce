import express from "express";
import { deleteUser, getAllUsers, getUser, new_user } from "../controllers/user.js";
import { onlyAdmin } from "../middlewares/auth.js";


const router = express.Router();

// Create user
router.post("/new", new_user);

// Get All users ---onlyonlyAdmin
router.get("/all", onlyAdmin, getAllUsers);

// Get single user and delete user ---onlyonlyAdmin
router.route("/:id").get(onlyAdmin, getUser).delete(onlyAdmin, deleteUser);


    
export default router;