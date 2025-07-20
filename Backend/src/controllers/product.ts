import { Request } from "express";
import { tryCatch } from "../middlewares/error.js";
import { AddProductRequestBody } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";

export const addProduct = tryCatch(
  async (req: Request<{}, {}, AddProductRequestBody>, res, next) => {
    const { name, category, price, stock, description } = req.body;
    const photos = req.files;

    if (photos?.length == 0)
      return next(new ErrorHandler("Please upload at least one photo.", 400));

    if (!name || !category || !price || !stock || !description) {
      
        if (Array.isArray(photos)) {
        for (let i = 0; i < photos.length; i++) {
          await rm(photos[i].path, (err) =>{
            if(err){
                console.error(`An error occurred while deleting this path ${photos[i].path}`);
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
