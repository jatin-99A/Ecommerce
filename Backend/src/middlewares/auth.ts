import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { tryCatch } from "./error.js";

// For authoization
export const authorizeRoles = (...allowedRoles: string[]) =>
  tryCatch(async (req, res, next) => {
    const { id } = req.query;

    if (!id) return next(new ErrorHandler("You must be login", 401));

    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("Invalid ID", 401));

    if (!allowedRoles.includes(user.role)) {
      return next(
        new ErrorHandler(
          `Access denied. Allowed roles: ${allowedRoles.join(", ")}`,
          403
        )
      );
    }

    next();
  });
