import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import setupArtistRoutes from './src/handlers/artist';
import setupUploadRoutes from './src/handlers/upload';
import { errorHandler } from './src/utils/error-handling';

const app: Express = express();
const port = 8018;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('query parser', 'extended');
app.use(cookieParser());
app.use(express.static('./public'));
app.use(cors());

setupUploadRoutes(app);
setupArtistRoutes(app);

app.use(errorHandler);
require('./src/utils/cron-jobs');

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
