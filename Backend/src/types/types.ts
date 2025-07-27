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

// Searched query body type
export interface SearchedQueryBody {
  search?: string;
  category?: string;
  brand?: string;
  ltePrice?: string;
  gtePrice?: string;
  rating?:  string;
  sort?: string;
  page?: string;
}

// Query object type for searched
export interface SearchQueryObject {
  search?: { $regex: string, $options: string };
  category?: string;
  brand?: string;
  price?: { $lte?: number, $gte?: number};
  rating?:  { $gte: number};
  sort?: string;
  page?: number;
}