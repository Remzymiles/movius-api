import vine from '@vinejs/vine'

export const textRecognitionValidator = vine.compile(
  vine.object({
    description: vine.string().minLength(10).maxLength(2000),
  })
)
