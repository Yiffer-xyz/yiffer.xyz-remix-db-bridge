import { Express } from 'express';
import { handle } from '../../utils/handleRoute';
import { handleGetArtists } from './getArtists';

export default function setupRoutes(app: Express) {
  app.get('/artists', handle(handleGetArtists));
}
