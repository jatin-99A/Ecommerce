import express from "express";
import { new_user } from "../controllers/user.js";

const router = express.Router();

router.post("/new", new_user);

    
export default router;