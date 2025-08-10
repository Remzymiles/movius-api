import vine from '@vinejs/vine'

export const updateUserValidation = vine.compile(
  vine.object({
    full_name: vine.string().optional(),
    phone: vine.string().optional(),
    email: vine.string().email().optional(),
  })
)
