import { User } from "../models/user.js";
import { tryCatch } from "../middlewares/error.js";

export const new_user = tryCatch(
  async (req, res, next) => {
    const { name, email, photo, gender, _id, dob } = req.body;

    const user = await User.create({
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
  }
);
