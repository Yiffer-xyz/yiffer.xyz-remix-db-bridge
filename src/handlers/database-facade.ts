import { Express, NextFunction, Request, Response } from 'express';
import { MysqlError } from 'mysql';
import config from '../utils/config';
import { queryDbSimple } from '../utils/db';
const apiRoot = config.apiRootPath;

interface QueryDbRequest {
  query: string;
  params?: any[];
}

export default function setupRoutes(app: Express) {
  app.post(`${apiRoot}/query-db`, handleDbQuery);
}

async function handleDbQuery(req: Request, res: Response, next: NextFunction) {
  try {
    const { query, params } = req.body as QueryDbRequest;
    const result = await queryDbSimple(query, params);
    res.json({ result });
  } catch (err: MysqlError | any) {
    res.json({
      error: {
        sqlMessage: err.sqlMessage,
        code: err.code,
        sql: err.sql,
      },
    });
  }
}
