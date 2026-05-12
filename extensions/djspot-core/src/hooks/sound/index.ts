import { defineHook } from '@directus/extensions-sdk';

export default defineHook(({ action }, { services }: any) => {
  const { ItemsService, NotificationsService } = services;

  // When a new sound is created, notify all followers of the DJ
  action(
    'sound.items.create',
    async ({ payload, key }, { database, schema }) => {
      if (!schema || !payload.dj) return;

      const djService = new ItemsService('dj', { schema, knex: database });
      const followService = new ItemsService('user_dj_follow', {
        schema,
        knex: database,
      });
      const notificationsService = new NotificationsService({
        schema,
        knex: database,
      });

      const [dj, followers]: [
        { name: string },
        Array<{ user_created: string }>,
      ] = await Promise.all([
        djService.readOne(payload.dj, { fields: ['name'] }),
        followService.readByQuery({
          filter: { dj: { _eq: payload.dj } },
          fields: ['user_created'],
          limit: -1,
        }),
      ]);

      if (followers.length === 0) return;

      await Promise.all(
        followers.map((follow) =>
          notificationsService.createOne({
            recipient: follow.user_created,
            subject: 'notification.new_sound_uploaded',
            message: JSON.stringify({ djName: dj.name }),
            collection: 'sound',
            item: String(key),
          }),
        ),
      );
    },
  );
});
