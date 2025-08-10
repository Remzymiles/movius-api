import logger from '@adonisjs/core/services/logger'
import { BaseMail } from '@adonisjs/mail'
import User from '../models/user.js'

export default class ResetPasswordNotification extends BaseMail {
  public readonly subject = ' Reset Your Password | Biz Hero'
  private readonly view = 'emails/password_reset'

  constructor(
    private readonly user: User,
    private readonly token: string
  ) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    logger.info('Preparing to send password reset email to %s', this.user.email)

    this.message.to(this.user.email).htmlView(this.view, { user: this.user, code: this.token })
  }
}
