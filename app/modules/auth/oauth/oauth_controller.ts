import { BaseController } from '#base/base.controller'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { OAuthService } from './oauth_service.js'
import { googleAuthValidator } from './validator/oauth_validator.js'

@inject()
export default class OAuthController extends BaseController {
  constructor(
    protected ctx: HttpContext,
    private readonly oauthService: OAuthService
  ) {
    super()
  }

  /**
   * @googleAuth
   * @description Handle Google OAuth authentication
   * @requestBody { token: string } - Google OAuth token
   * @responseBody 200 - User data on success
   * @responseBody 401 - Error message on failure
   */
  public async googleAuth() {
    const { token } = await this.ctx.request.validateUsing(googleAuthValidator)
    const userData = await this.oauthService.handleGoogleAuth(token)

    return this.transformResponse('Success', userData)
  }
}
