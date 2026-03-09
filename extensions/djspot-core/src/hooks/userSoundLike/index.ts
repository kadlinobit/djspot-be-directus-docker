import { defineHook } from '@directus/extensions-sdk';
import type { Filter } from '@directus/types';
import { createError } from '@directus/errors';

interface ICreateLikePayload {
  sound: string;
}

type IDeleteLikePayload = Array<number>;

export default defineHook(async ({ filter, action }, { services }) => {
  const { ItemsService } = services;

  filter<ICreateLikePayload | undefined>(
    'user_sound_like.items.create',
    async (input, {}, { database, schema, accountability }) => {
      if (!schema || !accountability) return input;
      const likeService = new ItemsService('user_sound_like', {
        schema,
        accountability,
        knex: database,
      });
      const filter: Filter = {
        _and: [
          { user_created: { _eq: accountability.user } },
          { sound: { _eq: input?.sound } },
        ],
      };

      const results = await likeService.readByQuery({
        filter,
        fields: ['id'],
      });

      if (results.length > 0) {
        const ForbiddenError = createError(
          'UNPROCESSABLE_CONTENT',
          'You cant like sound more than once',
          422,
        );
        throw new ForbiddenError();
      }
      return input;
    },
  );

  filter<IDeleteLikePayload>(
    'user_sound_like.items.delete',
    async (input, {}, { database, schema, accountability }) => {
      if (!schema || !accountability) return input;

      const soundService = new ItemsService('sound', {
        schema,
        knex: database,
      });
      const likeService = new ItemsService('user_sound_like', {
        schema,
        accountability,
        knex: database,
      });

      for (const followId of input) {
        try {
          const likeRecord = await likeService.readOne(followId, {
            fields: ['sound'],
          });
          const sound = await soundService.readOne(likeRecord.sound, {
            fields: ['id', 'like_count'],
          });
          await soundService.updateOne(likeRecord.sound, {
            like_count: sound.like_count - 1,
          });
        } catch (error: any) {
          const UnknownError = createError(
            'INTERNAL_SERVER_ERROR',
            error?.message || 'Internal server error',
            500,
          );
          throw new UnknownError();
        }
      }

      return input;
    },
  );

  action(
    'user_sound_like.items.create',
    async ({ payload }, { database, schema, accountability }) => {
      if (!schema || !accountability) return;

      const soundService = new ItemsService('sound', {
        schema,
        knex: database,
      });
      const likeService = new ItemsService('user_sound_like', {
        schema,
        accountability,
        knex: database,
      });

      const filter = {
        sound: { _eq: payload.sound },
      };

      const follows = await likeService.readByQuery({
        filter,
        fields: ['id'],
      });

      soundService.updateOne(payload.sound, { like_count: follows.length });
    },
  );
});
