import vine from '@vinejs/vine';

export const verifyPasswordTokenValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    token: vine.number(),
    password: vine.string().optional(),
  }),
);
