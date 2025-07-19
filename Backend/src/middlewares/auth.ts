import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { tryCatch } from "./error.js";

export const onlyAdmin = tryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("You must be login", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Invalid ID", 401));
  if (user.role !== "admin")
    return next(new ErrorHandler("This action is exclusively reserved for Admin", 403));

  next();
});
