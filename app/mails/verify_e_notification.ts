import User from '#models/user';
import logger from '@adonisjs/core/services/logger';
import { BaseMail } from '@adonisjs/mail';

export default class VerifyENotification extends BaseMail {
  public readonly subject = 'Verify your Biz Hero account';
  private readonly view = 'emails/verify_email_html';
  private readonly user: User;
  private readonly code: string;

  constructor(user: User, code: string) {
    super();
    this.user = user;
    this.code = code;
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    logger.info('Preparing to send verification email to %s', this.user.email);
    console.log({ code: this.code });
    this.message.to(this.user.email).htmlView(this.view, { user: this.user, code: this.code });
  }
}
