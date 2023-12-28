import fs from 'fs';
import yaml from 'js-yaml';

let fileContents = fs.readFileSync('config/cfg.yml', 'utf8');
const config = yaml.load(fileContents) as AppConfig;

// TODO: validate config fields, fail on startup

export default config;

export interface AppConfig {
  apiRootPath: string;
  googleCloudConfigFilePath: string;
  db: {
    connectionLimit: number;
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    charset: string;
  };
  storage: {
    bucketName: string;
    comicsBucketFolder: string;
    unapprovedComicsBucketFolder: string;
    staticStorageUrl: string;
  };
  tempUploadsFolder: string;
}
