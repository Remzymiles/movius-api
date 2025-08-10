import vine from '@vinejs/vine';

export const resendUserVerificationOtpValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
  }),
);
