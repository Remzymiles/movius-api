import { SEVEN_HOURS_IN_MILLISECONDS } from '#base/base.constant'
import BadRequestException from '#exceptions/bad_request_exception'
import ConflictException from '#exceptions/conflict_exception'
import ForbiddenException from '#exceptions/forbidden_exception'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import NotFoundException from '#exceptions/not_found_exception'
import VerifyENotification from '#mails/verify_e_notification'
import WelcomeENotification from '#mails/welcome_e_notification'
import AccountVerificationToken from '#models/account_verification_token'
import Role from '#models/role'
import User from '#models/user'
import UserRole from '#models/user_role'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import { inject } from '@adonisjs/core'
import { cuid, safeEqual } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import logger from '@adonisjs/core/services/logger'
import db from '@adonisjs/lucid/services/db'
import mail from '@adonisjs/mail/services/main'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import { ROLES } from '../../role/roles.enum.js'
import { IOtp } from '../../utils/utils.interface.js'
import { UtilsService } from '../../utils/utils_service.js'
import { registerUserValidator } from './validator/register-user.dto.js'

@inject()
export default class RegisterService {
  constructor(private utilsService: UtilsService) {}

  public async registerUser(data: Infer<typeof registerUserValidator>) {
    let user: User | null = null

    if (!data.full_name) {
      throw new BadRequestException('Full name is required')
    }

    try {
      user = await User.create({ ...data })
      const role = await Role.query().where('name', ROLES.USER).firstOrFail()

      // attach role to user
      await user.related('roles').attach({
        [role.id]: {
          cuid: cuid(),
        },
      })

      // throw new ForbiddenException('Alu');
    } catch (e) {
      if (user) {
        await this.rollBackUser(user)
      }
      throw new InternalServerErrorException(e.message)
    }

    let authToken: AccessToken | null = null
    try {
      authToken = await User.accessTokens.create(user)

      await this.sendVerificationMail(user)
    } catch (e) {
      logger.error(e.message)
    }

    return { user, authToken: authToken?.value!.release() }
  }

  private async rollBackUser(user: User) {
    await User.query().where('id', user.id).delete()
  }

  private async sendVerificationMail(user: User) {
    // generate a token
    const token = this.utilsService.generateOtp({
      size: 5,
      validityDuration: SEVEN_HOURS_IN_MILLISECONDS,
    }) as IOtp

    if (!token) {
      return
    }

    console.log('Verification Token:', token.otp)

    const hashedToken = await this.utilsService.encryptString(token.otp)

    const expirationTime = new Date(token.expiration_time)

    await AccountVerificationToken.create({
      token: hashedToken,
      expiration_time: DateTime.fromJSDate(expirationTime),
      user_id: user.id,
      used: false,
    })

    mail.sendLater(new VerifyENotification(user, token.otp))
  }

  public async resendVerificationMail(email: string) {
    const user = await User.query().where('email', email).preload('roles').first()

    if (!user) {
      throw new NotFoundException('User with email not found')
    }

    const isUserActive = user.roles.some((userRole) => safeEqual(userRole.slug, ROLES.ACTIVE))

    if (isUserActive) {
      throw new ForbiddenException('Your account is already active')
    }

    await this.sendVerificationMail(user)
  }

  public async verifyAccount(email: string, token: number) {
    const trx = await db.transaction()

    const user = await User.query({
      client: trx,
    })
      .where('email', email)
      .preload('roles')
      .first()

    if (!user) {
      throw new NotFoundException('User with this email not found')
    }

    const isUserActive = user.roles.some((userRole) => safeEqual(userRole.slug, ROLES.ACTIVE))

    if (isUserActive) {
      throw new ForbiddenException('Your account is already active')
    }

    const accountVerificationToken = await AccountVerificationToken.query()
      .where({
        user_id: user.id,
      })
      .orderBy('created_at', 'desc')
      .first()

    if (!accountVerificationToken) {
      throw new BadRequestException('Error occurred, try sending verification again')
    }

    if (accountVerificationToken.used) {
      throw new BadRequestException('Account already verified with this code')
    }

    if (this.utilsService.timeElapsed(accountVerificationToken.expiration_time.toJSDate())) {
      throw new ConflictException('Validation code expired')
    }

    let verifyNumber: boolean = await hash.verify(accountVerificationToken.token, token.toString())

    if (!verifyNumber) {
      throw new ConflictException('Invalid validation code')
    }

    accountVerificationToken.used = true
    await accountVerificationToken.save()

    // create active role for the user
    const role = (await Role.findByOrFail('slug', ROLES.ACTIVE)).useTransaction(trx)
    await UserRole.create({
      role_id: role.id,
      user_id: user.id,
    })

    user.is_active = true
    user.is_email_verified = true

    await user.save()
    await trx.commit()

    await mail.sendLater(new WelcomeENotification(user))

    return user.toJSON()
  }
}
