import { User } from "../models/user.js";
import { tryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import { NextFunction, Request, Response } from "express";
import { NewUserRequestBody } from "../types/types.js";

export const new_user = tryCatch(async (req:Request<{},{},NewUserRequestBody>, res:Response, next:NextFunction) => {
  const { name, email, photo, gender, _id, dob } = req.body;

  let user = await User.findOne({ _id });

  if (user) {
    return res.status(200).json({
      success: true,
      message: `Welcome back!, ${user.name}`,
    });
  }

  if (!_id || !name || !email || !photo || !gender || !dob)
    return next(new ErrorHandler("All fields must be filled", 400));

  user = await User.create({
    name,
    email,
    photo,
    gender,
    _id,
    dob,
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: `Welcome ${user.name}`,
    });
  }
});

// Get all users  ---ADMIN
export const getAllUsers = tryCatch(async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  });
});

// Get single user by ID  ---ADMIN
export const getUser = tryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid Id", 400));

  return res.status(200).json({
    success: true,
    user,
  });
});

// Delete user  ---ADMIN
export const deleteUser = tryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid Id", 400));

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
