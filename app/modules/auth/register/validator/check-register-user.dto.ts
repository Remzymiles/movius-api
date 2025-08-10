import vine from '@vinejs/vine'

export const checkRegisterUserValidator = vine.compile(
  vine.object({
    full_name: vine.string().trim().optional(),
    email: vine
      .string()
      .email()
      .unique(async (db, value, field) => {
        const user = await db.from('users').where(field.name.toString(), value).first()
        return !user
      })
      .trim(),
  })
)
