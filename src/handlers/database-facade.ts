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
  app.post(`${apiRoot}/query-db-multiple`, handleMultipleDbQueries);
}

async function handleMultipleDbQueries(req: Request, res: Response, next: NextFunction) {
  const queriesWithParams = req.body as QueryDbRequest[];
  const allResults = await Promise.all(
    queriesWithParams.map(qwp => executeQuery(qwp.query, qwp.params))
  );

  const err = allResults.find(res => !!res.err);
  if (err) {
    console.log(err);
    res.json(err);
    return;
  }

  const returnValList = allResults.map(res => res.returnVal);
  res.json({
    result: returnValList,
    isError: false,
  });
}

async function handleDbQuery(req: Request, res: Response, next: NextFunction) {
  const { query, params } = req.body as QueryDbRequest;

  console.log(query);
  console.log(params);
  console.log('\n');

  if (query.includes('wINSERT INTO user (username')) {
    console.log('RETURNING ERROR');
    res.json({
      errorMessage: 'Datbase error',
      errorCode: '123',
    });
    return;
  }

  let { returnVal, err } = await executeQuery(query, params);
  res.json(returnVal || err);
}

async function executeQuery(
  query: string,
  params?: any[]
): Promise<{
  returnVal?: any;
  err?: any;
}> {
  try {
    let result = await queryDbSimple(query, params);

    if (Array.isArray(result)) {
      result = result.filter(v => !Object.values(v).every(v => v === null));
    }

    const returnVal = { result, insertId: null, isError: false };
    if (result.insertId) returnVal.insertId = result.insertId;
    return {
      returnVal,
    };
  } catch (err: MysqlError | any) {
    const error = {
      errorMessage: err.sqlMessage,
      isError: true,
      sql: err.sql,
      errorCode: err.code,
    };
    if (err.code === 'PROTOCOL_SEQUENCE_TIMEOUT' && !err.sqlMessage) {
      error.errorMessage = 'Database timeout';
    }
    return { err: error };
  }
}
