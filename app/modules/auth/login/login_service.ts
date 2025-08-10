import Login from '#models/login'
import User from '#models/user'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { LoginDeviceService } from '../login-device/login_device.js'
import { LoginLocationService } from '../login-location/login_location_service.js'

@inject()
export default class LoginService {
  constructor(
    private readonly loginDeviceService: LoginDeviceService,
    private readonly loginLocationService: LoginLocationService,
    protected ctx: HttpContext
  ) {}

  /**
   * Login user
   */
  public async login(email: string, password: string) {
    // const deleteAccountRequest = await UsersDeleteRequest.findBy({ user_id: user.id });

    // if (deleteAccountRequest) {
    //   throw new ForbiddenException('You are forbidden to login');
    // }

    const user = await User.verifyCredentials(email, password)

    const ipAddress = this.ctx.request.ip()
    const requestBrowser = this.ctx.request.headers()['user-agent']

    const loginDevice = await this.loginDeviceService.create(user, requestBrowser)
    const loginLocation = await this.loginLocationService.create(user, ipAddress)

    // delete all old tokens
    await this.deleteAllOldTokens(user)

    const authToken = await User.accessTokens.create(user)

    await Login.create({
      user_id: user.id,
      login_location_id: loginLocation?.id,
      login_device_id: loginDevice.id,
    })
    logger.info('User logged in', {
      user_id: user.id,
      email: user.email,
      ip_address: ipAddress,
      browser: requestBrowser,
    })

    return {
      user,
      authToken: authToken.value!.release(),
    }
  }

  private async deleteAllOldTokens(user: User) {
    const oldTokens = await User.accessTokens.all(user)

    for (const token of oldTokens) {
      await User.accessTokens.delete(user, token.identifier)
    }
  }
}
