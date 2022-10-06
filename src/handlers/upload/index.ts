import { Express } from 'express';
import config from '../../utils/config';
import { handle } from '../../utils/handleRoute';
import { handleNewUpload } from './newUpload';
const apiRoot = config.apiRootPath;

import multer from 'multer';
import { handleComicFilesUpload } from './fileUploadHandler';
const upload = multer({ dest: `./${config.tempUploadsFolder}` });

export default function setupRoutes(app: Express) {
  app.post(`${apiRoot}/upload`, handle(handleNewUpload));
  app.post(`${apiRoot}/upload-pages`, upload.array('files'), handle(handleComicFilesUpload));
}
