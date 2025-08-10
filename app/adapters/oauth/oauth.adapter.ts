import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import httpStatus from 'http-status'
import { OAuthData, OAuthManagement, OAuthResponseData } from './oauth.interface.js'
import { GoogleOAuthAdapter } from './providers/google/google-oauth.adapter.js'

@inject()
export class OAuthAdapter implements OAuthManagement {
  constructor(private readonly googleOAuthAdapter: GoogleOAuthAdapter) {}

  public async authenticate(data: OAuthData): Promise<OAuthResponseData> {
    try {
      return await this.googleOAuthAdapter.authenticate(data)
    } catch (error) {
      throw new Exception(error.message, {
        status: httpStatus.UNAUTHORIZED,
        cause: error,
      })
    }
  }
}
