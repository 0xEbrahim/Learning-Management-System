import { Request, Response, NextFunction } from "express";
export default (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) =>
    await fn(req, res, next).catch(next);
