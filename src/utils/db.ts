import mysql from 'mysql';
import config from './config';
import { ApiError, makeApiError } from './error-handling';

let mysqlPool = mysql.createPool(config.db);

// The one handling the DB queries from Remix.
export async function queryDbSimple(query: string, params: any[] = []) {
  return new Promise((resolve, reject) => {
    mysqlPool.query(query, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// Keeping this here just in case.
export async function queryDb(
  query: string,
  queryParams: any[] = [],
  errorMessage: string = ''
): Promise<any> {
  return new Promise((resolve, reject) => {
    mysqlPool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }
      if (!connection) {
        reject('Could not establish database connection');
      }

      connection.query(query, queryParams, (err, results) => {
        connection.release();
        if (err) {
          reject(processDbError(err, errorMessage));
        } else {
          resolve(results);
        }
      });
    });
  });
}

function processDbError(err: mysql.MysqlError, errorMessage: string = ''): ApiError {
  const logMessage = `Code: ${err.code}, sqlMessage: ${err.sqlMessage}, sql: ${err.sql}`;
  return makeApiError(errorMessage, 500, logMessage);
}
