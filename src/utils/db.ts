import mysql from 'mysql';
import config from './config';
import { ApiError, makeApiError } from './error-handling';

let mysqlPool = mysql.createPool(config.db);

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
