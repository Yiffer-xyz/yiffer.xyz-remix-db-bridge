import { Express } from 'express';
import config from '../../utils/config';
import { handle } from '../../utils/handleRoute';
import { handleNewUpload } from './newUpload';

import multer from 'multer';
import { handleComicFilesUpload } from './fileUploadHandler';
const upload = multer({ dest: `./${config.tempUploadsFolder}` });

export default function setupRoutes(app: Express) {
  app.post('/upload', handle(handleNewUpload));
  app.post('/upload-pages', upload.array('files'), handle(handleComicFilesUpload));
}
