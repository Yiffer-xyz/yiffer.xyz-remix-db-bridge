import { queryDb } from '../utils/db';
import { Artist } from './types';

export async function getAllArtists(includePending: boolean = false): Promise<Artist[]> {
  let query = `SELECT
      Id AS id,
      Name AS name,
      PatreonName AS patreonName, 
      E621Name AS e621Name,
      IsPending as isPending
    FROM artist`;
  if (!includePending) {
    query += ' WHERE IsPending = 0';
  }
  const artists = await queryDb(query, []);
  return artists as Artist[];
}
