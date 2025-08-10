import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

/**
 * Validates the Google OAuth token
 */
export const googleAuthValidator = vine.compile(
  vine.object({
    token: vine.string(),
  })
)

export type GoogleAuthValidatorType = Infer<typeof googleAuthValidator>
