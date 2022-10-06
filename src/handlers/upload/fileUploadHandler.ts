import { NextFunction, Request, Response } from 'express';
import { makeApiError } from '../../utils/error-handling';
import { writeGoogleComicFile } from '../../utils/googleStorage';

export async function handleComicFilesUpload(req: Request, res: Response, next: NextFunction) {
  let files = req.files;
  let comicName = req.body.comicName;
  let uploadId = req.body.uploadId;

  if (!files || !files.length) {
    throw makeApiError('No files uploaded or comic name missing', 400);
  }
  if (!comicName || !uploadId) {
    throw makeApiError('Missing comicName or uploadId', 400);
  }

  files = files as Express.Multer.File[];
  validateFiles(files);
  const fileWritePromises: Promise<void>[] = [];
  for (let file of files) {
    if (file.originalname.includes('thumbnail')) {
      fileWritePromises.push(uploadComicThumbnailFile(file, uploadId));
    } else {
      fileWritePromises.push(uploadComicPageFile(file, uploadId));
    }
  }

  await Promise.all(fileWritePromises);
  res.status(201).end();
}

export async function uploadComicPageFile(file: Express.Multer.File, folderName: string) {
  // TODO: Downscale huge images, convert to jpg
  // Either locally (Sharp), or via CF Images, or Cloudinary.
  return writeGoogleComicFile(file.path, folderName, file.originalname, true);
}

export async function uploadComicThumbnailFile(file: Express.Multer.File, folderName: string) {
  // TODO: Process. thumbnail.webp, thumbnail.jpg, thumbnail-small.webp.
  await Promise.all([
    writeGoogleComicFile(file.path, folderName, 'thumbnail.jpg', true),
    writeGoogleComicFile(file.path, folderName, 'thumbnail-small.webp', true),
    writeGoogleComicFile(file.path, folderName, 'thumbnail.webp', true),
  ]);
  return;
}

function validateFiles(files: Express.Multer.File[]) {
  const validMimeTypes = ['image/png', 'image/jpeg', 'image/webp'];
  const validFilenameRegex = /^thumbnail\..+|^\d{3}\.\w+/;
  for (let file of files) {
    if (!validMimeTypes.includes(file.mimetype)) {
      throw makeApiError(`Invalid file type for file ${file.originalname}`, 400);
    }
    if (!validFilenameRegex.test(file.originalname)) {
      throw makeApiError(`Invalid file name for file ${file.originalname}`, 400);
    }
  }
}
