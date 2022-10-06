import { NextFunction, Request, Response } from 'express';
import { queryDb } from '../../utils/db';
import { makeApiError } from '../../utils/error-handling';

// Only called in a new request after all files have been uploaded to storage
export async function handleNewUpload(req: Request, res: Response, next: NextFunction) {
  const uploadBody = validateUploadBody(req.body);
  await processUpload(uploadBody, req.ip);
  res.status(201).end();
  console.log(`Upload ${uploadBody.uploadId} processed, page count: ${uploadBody.numberOfPages}`);
}

export async function processUpload(uploadBody: UploadBody, userIP: string) {
  if (uploadBody.newArtist) {
    uploadBody.artistId = await createPendingArtist(uploadBody.newArtist);
  }

  const userId = 1; // TODO: Get user id from session. Gotta set up that, yep.

  const query = buildUploadQuery(uploadBody, userIP, userId);
  const result = await queryDb(query.query, query.values, 'Error adding comic to database');
  const comicId = result.insertId;

  if (uploadBody.previousComic) {
    await createComicLink('prev', uploadBody.previousComic, comicId);
  }
  if (uploadBody.nextComic) {
    await createComicLink('next', uploadBody.nextComic, comicId);
  }
}

async function createComicLink(
  linkType: 'prev' | 'next',
  otherComic: AnyKindOfComic,
  newComicId: number
) {
  let prevField, nextField, prevValue, nextValue;

  let otherFieldSuffix = 'Comic';
  if (otherComic.isPending) {
    otherFieldSuffix = 'PendingComic';
  } else if (otherComic.isUpload) {
    otherFieldSuffix = 'UploadComic';
  }

  if (linkType === 'next') {
    prevField = 'firstUploadComic';
    prevValue = newComicId;
    nextField = 'last' + otherFieldSuffix;
    nextValue = otherComic.comicId;
  } else {
    nextField = 'lastUploadComic';
    nextValue = newComicId;
    prevField = 'first' + otherFieldSuffix;
    prevValue = otherComic.comicId;
  }

  const query = `
    INSERT INTO comicuploadlink (${prevField}, ${nextField})
    VALUES (?, ?)
  `;
  const values = [prevValue, nextValue];
  await queryDb(query, values);
}

function buildUploadQuery(
  uploadBody: UploadBody,
  userIp: string,
  userId?: number
): { query: string; values: any[] } {
  let query = `
    INSERT INTO comicupload
    (ComicName, UploadId, ArtistId, Cat, Tag, State, NumberOfPages, UserId, UserIP)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    uploadBody.comicName,
    uploadBody.uploadId,
    uploadBody.artistId,
    uploadBody.classification,
    uploadBody.category,
    uploadBody.state,
    uploadBody.numberOfPages,
    userId,
    userIp,
  ];
  return { query, values };
}

async function createPendingArtist(newArtist: NewArtist): Promise<number> {
  const insertQuery = `
    INSERT INTO artist (Name, E621name, PatreonName, IsPending)
    VALUES (?, ?, ?, ?)
  `;
  const insertValues = [
    newArtist.artistName,
    newArtist.e621Name || null,
    newArtist.patreonName || null,
    true,
  ];
  const insertResult = await queryDb(insertQuery, insertValues);
  const artistId = insertResult.insertId;

  if (newArtist.links) {
    await createArtistLinks(newArtist, artistId);
  }

  return artistId;
}

async function createArtistLinks(newArtist: NewArtist, newArtistId: number) {
  let linksWithTypes = newArtist.links
    .map(extractLinkTypeFromLinkUrl)
    .filter(link => link.linkUrl.length > 0);
  let linkInsertQuery = `
    INSERT INTO artistlink (ArtistId, LinkUrl, LinkType)
    VALUES 
  `;
  const linkInsertValues = [];
  for (let i = 0; i < linksWithTypes.length; i++) {
    linkInsertQuery += `(?, ?, ?)`;
    linkInsertValues.push(newArtistId, linksWithTypes[i].linkUrl, linksWithTypes[i].linkType);
    if (i < newArtist.links.length - 1) {
      linkInsertQuery += ', ';
    }
  }
  await queryDb(linkInsertQuery, linkInsertValues);
}

export function validateUploadBody(uploadBody: UploadBody): UploadBody {
  if (!uploadBody.uploadId) {
    throw makeApiError('Missing upload id', 400);
  }
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
  if (uploadBody.artistId === undefined && !uploadBody.newArtist) {
    throw makeApiError('Either an existing artist or a new one is required', 400);
  }
  if (!uploadBody.artistId && uploadBody.newArtist) {
    if (!uploadBody.newArtist.artistName || uploadBody.newArtist.artistName.length < 2) {
      throw makeApiError('New artist name is required or too short', 400);
    }
  }

  return uploadBody;
}

const linkWebsites = ['twitter', 'patreon', 'e621', 'furaffinity', 'deviantart', 'tumblr', 'pixiv'];

function extractLinkTypeFromLinkUrl(link: string): LinkWithType {
  let linkType = 'website';
  let linkUrl = link.trim();
  if (linkUrl.endsWith('/')) {
    linkUrl = linkUrl.slice(0, -1);
  }
  if (!linkUrl.startsWith('http://') && !linkUrl.startsWith('https://')) {
    linkUrl = 'https://' + linkUrl;
  }

  linkWebsites.forEach(linkTypeCandidate => {
    if (link.includes(linkTypeCandidate)) {
      linkType = linkTypeCandidate;
    }
  });

  return { linkUrl, linkType };
}

interface LinkWithType {
  linkUrl: string;
  linkType: string;
}

export interface UploadBody {
  comicName: string;
  artistId?: number;
  newArtist?: NewArtist;
  category: string;
  classification: string;
  state: string;
  previousComic?: AnyKindOfComic;
  nextComic?: AnyKindOfComic;
  tagIds: number[];
  numberOfPages: number;
  uploadId: string; // A random string to connect files to this upload
}

export interface NewArtist {
  artistName: string;
  e621Name?: string;
  patreonName?: string;
  links: string[];
}

// Can be either a live comic, a pending comic, or one uploaded but awaiting processing
export interface AnyKindOfComic {
  comicId: number;
  comicName?: string;
  isPending: boolean;
  isUpload: boolean;
}
