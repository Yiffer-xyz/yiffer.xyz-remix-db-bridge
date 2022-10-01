import { NextFunction, Request, Response } from 'express';
import { getComicByField } from '../../domain/comic';

// Just an example route, ignore the params and weird content.
export async function handleGetComic(req: Request, res: Response, next: NextFunction) {
  const comics = await getComicByField('Id', 2);
  res.json(comics);
}
