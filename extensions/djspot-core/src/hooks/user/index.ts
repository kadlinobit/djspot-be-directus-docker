import { defineHook } from '@directus/extensions-sdk';

export default defineHook(({ filter }, { services, exceptions }: any) => {
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
        throw new exceptions.InvalidCredentialsException();
      }

      const authService = new AuthenticationService({
        accountability,
        schema,
        knex: database,
      });

      try {
        await authService.verifyPassword(accountability.user, input.password_check);
      } catch (error) {
        throw new exceptions.InvalidCredentialsException();
      }

      delete input.password_check;
      return input;
    }
  );
});
