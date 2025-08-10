import vine from '@vinejs/vine';

export const changePasswordValidator = vine.compile(
  vine.object({
    old_password: vine.string(),
    password: vine.string().confirmed(),
  }),
);
