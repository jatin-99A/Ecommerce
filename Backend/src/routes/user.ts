import express from "express";
import { deleteUser, getAllUsers, getUser, new_user } from "../controllers/user.js";
import { authorizeRoles } from "../middlewares/auth.js";


const router = express.Router();

// Create user
router.post("/new", new_user);

// Get All users ---onlyonlyAdmin
router.get("/all", authorizeRoles('admin'), getAllUsers);

// Get single user and delete user ---onlyonlyAdmin
router.route("/:id").get(authorizeRoles('admin'), getUser).delete(authorizeRoles('admin'), deleteUser);


    
export default router;