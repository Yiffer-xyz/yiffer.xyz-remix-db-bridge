import { Storage } from '@google-cloud/storage';
import config from './config';
import { makeApiError } from './error-handling';
const storage = new Storage({ keyFilename: config.googleCloudConfigFilePath });
const bucket = storage.bucket(config.storage.bucketName);

export async function writeGoogleComicFile(
  localFilePath: string,
  comicName: string,
  filename: string,
  isPending: boolean
): Promise<void> {
  const folder = isPending
    ? config.storage.unapprovedComicsBucketFolder
    : config.storage.comicsBucketFolder;

  let uploadOptions = {
    destination: `${folder}/${comicName}/${filename}`,
    gzip: true,
  };

  console.log(`Uploading file ${folder}/${comicName}/${filename}`);

  return new Promise(resolve => {
    bucket.upload(localFilePath, uploadOptions, err => {
      if (err) {
        console.log('GOOGLE UPLOAD ERROR: ', err);
        throw makeApiError('Error uploading comic file to storage', 500);
      } else {
        resolve();
      }
    });
  });
}
