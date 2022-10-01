import { NextFunction, Request, Response } from 'express';

// Just a simple wrapper to ensure uncaught errors are handled through next
export function handle(func: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch(next);
  };
}
