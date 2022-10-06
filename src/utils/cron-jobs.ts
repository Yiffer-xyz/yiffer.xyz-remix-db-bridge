import cron from 'cron';
import config from './config';
import { deleteFile, listDir } from './filesystem-facade';

const CronJob = cron.CronJob;

let uploadsFolderCronJob = new CronJob(
  '0 10 * * *',
  clearUploadsFolder,
  null,
  true,
  'Europe/London'
);
uploadsFolderCronJob.start();

async function clearUploadsFolder() {
  try {
    console.log('Cron: Cleaning up uploads folder...');
    let uploadedFiles = await listDir(__dirname + `/../../../${config.tempUploadsFolder}`);
    console.log(`Found ${uploadedFiles.length} files`);
    for (let file of uploadedFiles) {
      console.log(file);
      await deleteFile(`${__dirname}/../../../${config.tempUploadsFolder}/${file}`);
    }
    console.log(`Deleted all upload files`);
  } catch (err) {
    console.log('Error clearing uploads folder: ', err);
  }
}
