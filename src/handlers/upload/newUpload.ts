import { NextFunction, Request, Response } from 'express';
import { makeApiError } from '../../utils/error-handling';

// These go in this file/folder, rather than "domain", because they are not reusable.
// They are specific to this route and this handler.
export async function handleNewUpload(req: Request, res: Response, next: NextFunction) {
  validateUploadBody(req.body);
  await processUpload(req.body);
}

// Same as the function above.
export async function processUpload(uploadBody: UploadBody) {
  // TODO: logic.
  // No need to fetch things like artist, comic links, tag ids,
  // since the foreign keys will make sure that fails if they don't exist.
  return;
}

export function validateUploadBody(uploadBody: UploadBody) {
  if (!uploadBody.comicName || uploadBody.comicName.length < 2) {
    throw makeApiError('Comic name is required or too short', 400);
  }
  if (!uploadBody.category) {
    throw makeApiError('Category is required', 400);
  }
  if (!uploadBody.classification) {
    throw makeApiError('Classification is required', 400);
  }
  if (!uploadBody.state) {
    throw makeApiError('State is required', 400);
  }
  if (uploadBody.artistId === undefined && !uploadBody.uploadArtistId && !uploadBody.newArtist) {
    throw makeApiError('Either artistId, uploadArtistId, or newArtist is required', 400);
  }
  if (uploadBody.newArtist) {
    if (!uploadBody.newArtist.artistName || uploadBody.newArtist.artistName.length < 2) {
      throw makeApiError('New artist name is required or too short', 400);
    }
  }
}

// These types are also specific to this handler, so they go here, instead of types.ts
export interface UploadBody {
  comicName: string;
  artistId?: number;
  uploadArtistId?: number;
  newArtist?: NewArtist;
  category: string;
  classification: string;
  state: string;
  previousComic?: AnyKindOfComic;
  nextComic?: AnyKindOfComic;
  tagIds: number[];
}

export interface NewArtist {
  artistName: string;
  e621Name: string;
  patreonName: string;
  links: string[];
}

// Can be either a live comic, a pending comic, or one uploaded but awaiting processing
export interface AnyKindOfComic {
  comicId: number;
  comicName?: string;
  isPending: boolean;
  isUpload: boolean;
}
