import { Express } from 'express';
import config from '../../utils/config';
import { handle } from '../../utils/handleRoute';
import { handleGetActionDashboardList } from './actionDashboard';
const apiRoot = config.apiRootPath;

export default function setupRoutes(app: Express) {
  app.get(`${apiRoot}/artists`, handle(handleGetActionDashboardList));
}
