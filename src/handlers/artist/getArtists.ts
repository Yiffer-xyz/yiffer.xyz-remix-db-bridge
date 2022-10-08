import { NextFunction, Request, Response } from 'express';
import { getAllArtists } from '../../domain/artist';

export async function handleGetArtists(req: Request, res: Response, next: NextFunction) {
  const includePending = req.query.includePending === 'true';
  const includeBanned = req.query.includePending === 'true';
  const artists = await getAllArtists(includePending, includeBanned);
  res.json(artists);
}
