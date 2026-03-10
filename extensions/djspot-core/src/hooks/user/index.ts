import { defineHook } from '@directus/extensions-sdk';
import { createError } from '@directus/errors';

export default defineHook(({ filter }, { services }) => {
  const { AuthenticationService } = services;

  filter(
    'users.update',
    async (input: any, {}, { database, schema, accountability }) => {
      // Do not perform check for admin and app access
      if (!accountability || (accountability.admin && accountability.app)) {
        return input;
      }

      if (!schema || !accountability.user) {
        return input;
      }

      if (!input.password_check) {
        const InvalidCredentialsException = createError(
          'INVALID_CREDENTIALS',
          'Invalid credentials',
          401
        );
        throw new InvalidCredentialsException();
      }

      const authService = new AuthenticationService({
        accountability,
        schema,
        knex: database,
      });

      try {
        await authService.verifyPassword(accountability.user, input.password_check);
      } catch (error) {
        const InvalidCredentialsException = createError(
          'INVALID_CREDENTIALS',
          'Invalid credentials',
          401
        );
        throw new InvalidCredentialsException();
      }

      delete input.password_check;
      return input;
    }
  );
});
