import {Request, Response, NextFunction} from 'express';

// Controller type
export type controllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;