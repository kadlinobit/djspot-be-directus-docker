import { defineEndpoint } from '@directus/extensions-sdk';

export default defineEndpoint((router, { database }: any) => {
  router.get('/sounds-count', async (_req: any, res: any) => {
    try {
      const rows = await database('genre')
        .select('genre.id', 'genre.name')
        .count('sound_genre.id as sounds_count')
        .leftJoin('sound_genre', 'sound_genre.genre_id', 'genre.id')
        .groupBy('genre.id', 'genre.name')
        .orderBy('sounds_count', 'desc');

      const result = rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        sounds_count: Number(row.sounds_count),
      }));

      res.json({ data: result });
    } catch (err: any) {
      res.status(500).json({ errors: [{ message: err.message }] });
    }
  });
});
