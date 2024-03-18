import type { Request, Response, NextFunction } from 'express';

export const handleHealthCheck = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    return res.sendStatus(200);
  } catch (error) {
    next(error);
    return null;
  }
};