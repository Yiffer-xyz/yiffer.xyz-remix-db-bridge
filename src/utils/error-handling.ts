import { Request, Response } from 'express';

export interface ApiError extends Error {
  message: string;
  statusCode: number;
  logMessage?: string;
  errorType: string;
}

export function makeApiError(message: string, statusCode: number, logMessage?: string): ApiError {
  const err = new Error(message) as ApiError;
  err.statusCode = statusCode;
  err.logMessage = logMessage;
  err.errorType = 'ApiError';
  return err;
}

export function errorHandler(err: any, req: Request, res: Response, next: any) {
  if (res.headersSent) {
    return next(err);
  }
  console.log(err); // TODO: temporary, for dev

  // Errors thrown manually, or by other catchers like DB handler. TODO log, maybe.
  if (err.ApiError) {
    res.status(err.statusCode).send(err.message);
    return;
  }

  // All uncaught errors will end up here. TODO log a lot. This should not happen.
  res.status(500).send('Unknown error occurred');
}
