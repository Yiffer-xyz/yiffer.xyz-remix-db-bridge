import { Express } from 'express';
import { handle } from '../../utils/handleRoute';
import { handleGetComic } from './getComic';

// All routes in the folder here
export default function setupRoutes(app: Express) {
  app.get('/comic', handle(handleGetComic));
}
