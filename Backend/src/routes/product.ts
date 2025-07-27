import express from "express";
import { authorizeRoles } from "../middlewares/auth.js";
import { 
  addProduct, 
  getSearchedProducts, 
  getSingleProduct, 
  updateProduct, 
  deleteProduct, 
  getLatestProducts, 
  bulkUpdateProducts,
  bulkDeleteProducts,
} from "../controllers/product.js";
import { multipleUpload } from "../middlewares/multer.js";

const router = express.Router();

// To create a new product
router.post("/new", authorizeRoles('admin','vendor'), multipleUpload, addProduct);

// To get all products 
router.get("/all", getSearchedProducts);

// To get products by category
router.get("/category/:category", getSearchedProducts);

// To get products by brand
router.get("/brand/:brand", getSearchedProducts);

// To get latest products
router.get("/latest", getLatestProducts);

// To get a single product by ID
router.get("/:id", getSingleProduct);

// To update a product by ID
router.put("/:id", authorizeRoles('admin','vendor'), updateProduct);

// To delete a product by ID
router.delete("/:id", authorizeRoles('admin','vendor'), deleteProduct);

// Bulk update products (admin only, if implemented)
router.put("/bulk-update", authorizeRoles('admin'), bulkUpdateProducts);

// Bulk delete products (admin only, if implemented)
router.delete("/bulk-delete", authorizeRoles('admin'), bulkDeleteProducts);

export default router;