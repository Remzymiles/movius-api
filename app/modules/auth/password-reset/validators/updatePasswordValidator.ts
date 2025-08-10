import vine from '@vinejs/vine';

export const updatePasswordValidator = vine.compile(
  vine.object({
    password: vine.string().confirmed(),
    token: vine.number(),
    email: vine.string().email().trim(),
  }),
);
