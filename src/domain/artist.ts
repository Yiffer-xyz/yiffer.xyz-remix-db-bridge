import { queryDb } from '../utils/db';
import { Artist } from './types';

export async function getAllArtists(
  includePending: boolean = false,
  includeBanned: boolean = false
): Promise<Artist[]> {
  let query = `SELECT
      Id AS id,
      Name AS name,
      PatreonName AS patreonName, 
      E621Name AS e621Name,
      IsPending as isPending,
      IsBanned as isBanned
    FROM artist`;
  if (!includePending && !includeBanned) {
    query += ' WHERE IsPending = 0 AND IsBanned = 0';
  }
  if (!includePending && includeBanned) {
    query += ' WHERE IsPending = 0';
  }
  if (includeBanned && !includePending) {
    query += ' WHERE IsBanned = 0';
  }
  const artists = await queryDb(query, []);
  return artists as Artist[];
}
