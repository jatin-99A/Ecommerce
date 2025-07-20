import express from "express";
import { authorizeRoles } from "../middlewares/auth.js";
import { addProduct } from "../controllers/product.js";
import { multipleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/new",authorizeRoles('admin','vendor'), multipleUpload, addProduct);

    
export default router;