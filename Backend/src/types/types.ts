import {Request, Response, NextFunction} from 'express';

// New user request body
export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}
// Add product request body
export interface AddProductRequestBody {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

// Controller type
export type controllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;