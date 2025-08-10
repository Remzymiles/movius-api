import env from '#start/env'
import { Exception } from '@adonisjs/core/exceptions'
import { OAuth2Client } from 'google-auth-library'
import httpStatus from 'http-status'
import { OAuthData, OAuthManagement, OAuthResponseData } from '../../oauth.interface.js'

export class GoogleOAuthAdapter extends OAuth2Client implements OAuthManagement {
  constructor() {
    super({
      clientId: env.get('GOOGLE_CLIENT_ID'),
    })
  }

  async authenticate(data: OAuthData): Promise<OAuthResponseData> {
    const GOOGLE_CLIENT_ID = env.get('GOOGLE_CLIENT_ID')

    try {
      const userTicket = await this.verifyIdToken({
        idToken: data.token,
        audience: GOOGLE_CLIENT_ID,
      })

      const payload = userTicket.getPayload()
      if (!payload) {
        throw new Exception('Failed to get user payload from Google', {
          status: httpStatus.UNAUTHORIZED,
        })
      }

      if (!payload.email_verified) {
        throw new Exception('You need to verify your Google email first', {
          status: httpStatus.UNAUTHORIZED,
        })
      }

      return {
        email: payload.email!,
        first_name: payload.given_name!,
        last_name: payload.family_name!,
        picture: payload.picture,
        sub: payload.sub,
        email_verified: payload.email_verified,
        locale: payload.locale,
      }
    } catch (error) {
      throw new Exception(error.message, {
        status: httpStatus.UNAUTHORIZED,
        cause: error,
      })
    }
  }
}
