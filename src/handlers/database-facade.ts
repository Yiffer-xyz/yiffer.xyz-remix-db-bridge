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
    console.log(query);
    console.log(params);
    console.log('\n');
    const result = await queryDbSimple(query, params);
    const returnVal = { result, insertId: null };
    if (result.insertId) {
      returnVal.insertId = result.insertId;
    }
    res.json(returnVal);
  } catch (err: MysqlError | any) {
    console.error(err);
    res.json({
      errorMessage: 'Datbase error',
      errorCode: err.code,
    });
  }
}
