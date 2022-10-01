import { queryDb } from '../utils/db';
import { Comic } from './types';

// Just an example for now.
// Stuff in "domain" is reusable, is the idea.
// Anything specific to a single route/handler should be put in its file.
export async function getComicByField(fieldName: string, fieldValue: any): Promise<Comic | null> {
  const query = `SELECT * FROM comic WHERE ${fieldName} = ?`;
  const comic = await queryDb(query, [fieldValue], 'Error getting comic');
  if (comic.length === 0) {
    return null;
  }
  return comic[0];
}
