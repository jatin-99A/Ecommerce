import { Request } from "express";
import { tryCatch } from "../middlewares/error.js";
import {
  AddProductRequestBody,
  SearchedQueryBody,
  SearchQueryObject,
} from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import dotenv from 'dotenv';

dotenv.config();

// Add a new product ---------------------------------------------------------
export const addProduct = tryCatch(
  async (req: Request<{}, {}, AddProductRequestBody>, res, next) => {
    const { name, category, price, stock, description } = req.body;
    const photos = req.files;

    if (photos?.length == 0)
      return next(new ErrorHandler("Please upload at least one photo.", 400));

    if (!name || !category || !price || !stock || !description) {
      if (Array.isArray(photos)) {
        for (let i = 0; i < photos.length; i++) {
          await rm(photos[i].path, (err) => {
            if (err) {
              console.error(
                `An error occurred while deleting this path ${photos[i].path}`
              );
            }
            console.log(`Deleted path ${photos[i].path}`);
          });
        }
      }

      return next(new ErrorHandler("All fields must be filled", 400));
    }

    await Product.create({
      name,
      price,
      stock,
      category,
      photos: (photos as Express.Multer.File[])?.map(
        (photo: Express.Multer.File) => ({
          public_id: photo.filename,
          url: photo.path,
        })
      ),
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully!",
    });
  }
);

// Search product controller ------------------------------------------------------------
export const getSearchedProducts = tryCatch(
  async (req: Request<{}, {}, {}, SearchedQueryBody>, res, next) => {
    const queryObj: SearchQueryObject = {};

    // Filter: Search by name (case-insensitive)
    if (req.query.search) {
      queryObj.search = { $regex: req.query.search, $options: "i" };
    }

    // Filter: Category
    if (req.query.category) {
      queryObj.category = req.query.category;
    }

    // Filter: Brand
    if (req.query.brand) {
      queryObj.brand = req.query.brand;
    }

    // Filter: less than or equal to
    if (req.query.ltePrice) {
      queryObj.price = { ...queryObj.price, $lte: Number(req.query.ltePrice) };
    }

    // Filter: Price greater than or equal to
    if (req.query.gtePrice) {
      queryObj.price = { ...queryObj.price, $gte: Number(req.query.gtePrice) };
    }

    // Filter: Rating greater than or equal to
    if (req.query.rating) {
      queryObj.rating = { $gte: Number(req.query.rating) };
    }

    // Pagination
    const page = parseInt(req.query.page? req.query.page : '1');
    const limit:number = Number(process.env.LIMIT) || 10;
    const skip = (page - 1) * limit;

    // Sort by price
    let sortBy : Record<string, 1 | -1> = {};
    if (req.query.sort) {
      sortBy = {
        pirce: req.query.sort === 'asc'? 1 : -1,
      }
    }

    const totalProducts = await Product.countDocuments(queryObj);
    const products = await Product.find(queryObj)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .populate("reviews");

    res.status(200).json({
      success: true,
      count: products.length,
      total: totalProducts,
      page,
      pages: Math.ceil(totalProducts / limit),
      products,
    });
  }
);

// Get single product by ID ---------------------------------------------------
export const getSingleProduct = tryCatch(
  async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate("reviews");
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
      success: true,
      product,
    });
  }
);

// Update product by ID ---------------------------------------------------
export const updateProduct = tryCatch(
  async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Optionally handle photo updates here

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product,
    });
  }
);

// Delete product by ID ---------------------------------------------------
export const deleteProduct = tryCatch(
  async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    // Optionally handle photo deletion here

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully!",
    });
  }
);

// Get latest products (e.g., last 10 added) ---------------------------------------------------
export const getLatestProducts = tryCatch(
  async (req, res, next) => {
    const limit = Number(req.query.limit) || 10;
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("reviews");

    res.status(200).json({
      success: true,
      products,
    });
  }
);

// Bulk update products ---------------------------------------------------
export const bulkUpdateProducts = tryCatch(
  async (req, res, next) => {
    const { ids, updateData } = req.body; // ids: string[], updateData: object

    if (!Array.isArray(ids) || ids.length === 0 || !updateData) {
      return next(new ErrorHandler("Please provide product IDs and update data.", 400));
    }

    const result = await Product.updateMany(
      { _id: { $in: ids } },
      { $set: updateData }
    );

    res.status(200).json({
      success: true,
      message: "Products updated successfully!",
      modifiedCount: result.modifiedCount,
    });
  }
);

// Bulk delete products ---------------------------------------------------
export const bulkDeleteProducts = tryCatch(
  async (req, res, next) => {
    const { ids } = req.body; // ids: string[]

    if (!Array.isArray(ids) || ids.length === 0) {
      return next(new ErrorHandler("Please provide product IDs to delete.", 400));
    }

    const result = await Product.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: "Products deleted successfully!",
      deletedCount: result.deletedCount,
    });
  }
);