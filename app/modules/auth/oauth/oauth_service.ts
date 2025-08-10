import { RoleEnum } from '#models/enums/enums'
import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import { cuid } from '@adonisjs/core/helpers'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import httpStatus from 'http-status'
import { OAuthAdapter } from '../../../adapters/oauth/oauth.adapter.js'
import { OAuthResponseData } from '../../../adapters/oauth/oauth.interface.js'
import Role from '../../../models/role.js'
import User from '../../../models/user.js'
import { LoginDeviceService } from '../login-device/login_device.js'

@inject()
export class OAuthService {
  constructor(
    protected ctx: HttpContext,
    private readonly oauthAdapter: OAuthAdapter,
    private readonly loginDeviceService: LoginDeviceService
  ) {}

  /**
   * Handle Google OAuth authentication
   * @param token - Google OAuth token
   * @returns User data from Google
   * @throws Exception if authentication fails
   */
  public async handleGoogleAuth(token: string): Promise<OAuthResponseData> {
    try {
      const userData = await this.oauthAdapter.authenticate({ token })

      const user = await db.transaction(async (trx) => {
        let user = await User.findBy('email', userData.email)

        if (!user) {
          user = await User.create(
            {
              email: userData.email,
              full_name: `${userData.first_name} ${userData.last_name}`.trim(),
              is_email_verified: true,
              password: undefined,
            },
            { client: trx }
          )

          const role = await Role.findByOrFail({ title: RoleEnum.USER }, { client: trx })

          await user.related('roles').attach(
            {
              [role.id]: {
                id: cuid(),
              },
            },
            trx
          )
        } else {
          user.full_name = `${userData.first_name} ${userData.last_name}`.trim()
          user.is_email_verified = true
          await user.save()
        }

        return await User.query({ client: trx }).preload('roles').first()
      })

      if (!user) {
        throw new Exception('Failed to create or find user', {
          status: httpStatus.INTERNAL_SERVER_ERROR,
        })
      }

      const accessToken = await User.accessTokens.create(user)

      const userAgent = this.ctx.request.header('user-agent') as string
      await this.loginDeviceService.create(user, userAgent)

      return {
        ...userData,
        user,
        authToken: accessToken.value!.release(),
      }
    } catch (error) {
      throw new Exception(error.message, {
        status: httpStatus.UNAUTHORIZED,
        cause: error,
      })
    }
  }
}
