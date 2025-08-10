import ResetPasswordNotification from '#mails/reset_password_notification'
import PasswordReset from '#models/password_reset'
import User from '#models/user'
import { inject } from '@adonisjs/core'
import hash from '@adonisjs/core/services/hash'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'
import { Infer } from '@vinejs/vine/types'
import { DateTime } from 'luxon'
import { SEVEN_HOURS_IN_MILLISECONDS } from '../../../base/base.constant.js'
import BadRequestException from '../../../exceptions/bad_request_exception.js'
import InternalServerErrorException from '../../../exceptions/internal_server_error_exception.js'
import NotFoundException from '../../../exceptions/not_found_exception.js'
import { IOtp } from '../../utils/utils.interface.js'
import { UtilsService } from '../../utils/utils_service.js'
import { ChangePasswordDto } from './change-password.dto.js'
import { updatePasswordValidator } from './validators/updatePasswordValidator.js'

@inject()
export class PasswordResetService {
  constructor(private utilsService: UtilsService) {}

  public async create(email: string) {
    const user = await User.findBy({ email: email })

    if (!user) {
      throw new Error('User Not Found')
    }

    const token = this.utilsService.generateOtp({
      size: 5,
      validityDuration: SEVEN_HOURS_IN_MILLISECONDS,
    }) as IOtp

    console.log('Verification Token:', token.otp)

    const hashToken = await hash.make(token.otp)

    const expirationTime = new Date(Date.now() + SEVEN_HOURS_IN_MILLISECONDS)

    try {
      await PasswordReset.create({
        token: hashToken,
        user_id: user.id,
        expiration_time: DateTime.fromJSDate(expirationTime),
      })

      await mail.sendLater(new ResetPasswordNotification(user, token.otp))

      return user
    } catch (error) {
      logger.error(error.message, 'PasswordResetService.create')

      throw new InternalServerErrorException('Something went wrong')
    }
  }

  public async verifyToken(email: string, token: number) {
    const user = await User.findBy({ email: email })

    if (!user) {
      throw new BadRequestException('User Not Found')
    }

    const passwordReset = await PasswordReset.query()
      .where({ user_id: user.id, is_used: false })
      .orderBy('id', 'desc')
      .first()

    if (!passwordReset) {
      throw new BadRequestException('Cannot verify token, try again')
    }

    try {
      await this.throwIfVerificationFails(passwordReset, token)

      return user
    } catch (error) {
      logger.error(error.message)
      throw new BadRequestException(error.message)
    }
  }

  private async throwIfVerificationFails(passwordReset: PasswordReset, token: number) {
    if (!passwordReset) {
      throw new BadRequestException('Token not found')
    }

    if (this.utilsService.timeElapsed(passwordReset.expiration_time.toJSDate())) {
      throw new BadRequestException('Token Expired')
    }

    const isTokenMatched = await hash.verify(passwordReset.token, token.toString())

    if (!isTokenMatched) {
      throw new BadRequestException('Invalid Token')
    }
  }

  public async updatePassword(data: Infer<typeof updatePasswordValidator>) {
    const { token, email, password } = data

    const user = await User.findBy({ email })
    if (!user) {
      throw new Error('User Not Found')
    }

    const passwordReset = await PasswordReset.query()
      .where({ user_id: user.id, is_used: false })
      .orderBy('id', 'desc')
      .first()

    if (!passwordReset) {
      throw new BadRequestException('Cannot verify token, try again')
    }

    await this.throwIfVerificationFails(passwordReset, token)

    try {
      user.password = password
      await user.save()

      passwordReset.is_used = true
      await passwordReset.save()

      return user
    } catch (error) {
      logger.log(error.message, 'PasswordResetService.updatePassword')
      throw new InternalServerErrorException(error.message)
    }
  }

  public async changePassword(userId: number, data: ChangePasswordDto) {
    const { new_password, current_password } = data

    let user = await User.findOrFail(userId)
    if (!user) {
      throw new NotFoundException('User Not Found')
    }

    const isPasswordMatched = await hash.verify(user.password, current_password)

    if (!isPasswordMatched) {
      throw new BadRequestException('Incorrect password')
    }

    try {
      user.password = new_password
      await user.save()

      return user
    } catch (error) {
      logger.error(error.message, 'PasswordResetService.updatePassword')
      throw new InternalServerErrorException(error.message)
    }
  }
}
