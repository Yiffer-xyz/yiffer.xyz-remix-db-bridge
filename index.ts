import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import setupDbRoute from './src/handlers/database-facade';
import { errorHandler } from './src/utils/error-handling';

const app: Express = express();
const port = 8018;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('query parser', 'extended');
app.use(cookieParser());
app.use(express.static('./public'));
app.use(cors());

// This is the one route that will handle all of Remix' db queries until D1.
// This should be the only route in use.
setupDbRoute(app);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`⚡️[server]: DB-connector server is running at https://localhost:${port}`);
});
