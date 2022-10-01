import { Express } from 'express';
import { handle } from '../../utils/handleRoute';
import { handleNewUpload } from './newUpload';

// All routes in the folder here
export default function setupRoutes(app: Express) {
  app.post('/upload', handle(handleNewUpload));
}
