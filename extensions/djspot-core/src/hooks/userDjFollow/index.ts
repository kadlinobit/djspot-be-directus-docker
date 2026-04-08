import { defineHook } from '@directus/extensions-sdk';
import type { Filter } from '@directus/types';

interface ICreateFollowPayload {
  dj: string;
}

type IDeleteFollowPayload = Array<number>;

export default defineHook(async ({ filter, action }, { services, exceptions }: any) => {
  const { ItemsService } = services;

  filter<ICreateFollowPayload | undefined>(
    'user_dj_follow.items.create',
    async (input, {}, { database, schema, accountability }) => {
      if (!schema || !accountability) return input;
      const followService = new ItemsService('user_dj_follow', {
        schema,
        accountability,
        knex: database,
      });
      const filter: Filter = {
        _and: [
          { user_created: { _eq: accountability.user } },
          { dj: { _eq: input?.dj } },
        ],
      };

      const results = await followService.readByQuery({
        filter,
        fields: ['id'],
      });

      if (results.length > 0) {
        throw new exceptions.InvalidPayloadException('You cant follow DJ more than once');
      }
      return input;
    },
  );

  filter<IDeleteFollowPayload>(
    'user_dj_follow.items.delete',
    async (input, {}, { database, schema, accountability }) => {
      if (!schema || !accountability) return input;

      const djService = new ItemsService('dj', { schema, knex: database });
      const followService = new ItemsService('user_dj_follow', {
        schema,
        accountability,
        knex: database,
      });

      for (const followId of input) {
        try {
          const followRecord = await followService.readOne(followId, {
            fields: ['dj'],
          });
          const dj = await djService.readOne(followRecord.dj, {
            fields: ['id', 'follow_count'],
          });
          await djService.updateOne(followRecord.dj, {
            follow_count: dj.follow_count - 1,
          });
        } catch (error: any) {
          throw new Error(error?.message || 'Internal server error');
        }
      }

      return input;
    },
  );

  action(
    'user_dj_follow.items.create',
    async ({ payload }, { database, schema, accountability }) => {
      if (!schema || !accountability) return;

      const djService = new ItemsService('dj', { schema, knex: database });
      const followService = new ItemsService('user_dj_follow', {
        schema,
        accountability,
        knex: database,
      });

      const filter = {
        dj: { _eq: payload.dj },
      };

      const follows = await followService.readByQuery({
        filter,
        fields: ['id'],
      });

      djService.updateOne(payload.dj, { follow_count: follows.length });
    },
  );
});
