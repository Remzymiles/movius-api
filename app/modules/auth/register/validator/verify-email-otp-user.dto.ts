import vine from '@vinejs/vine';

export const verifyEmailOtpValidator = vine.compile(
  vine.object({
    email: vine.string().trim(),
    token: vine.number(),
  }),
);
