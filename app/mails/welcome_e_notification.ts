import logger from '@adonisjs/core/services/logger';
import { BaseMail } from '@adonisjs/mail';
import User from '../models/user.js';

export default class WelcomeENotification extends BaseMail {
  public readonly subject = 'Welcome to Biz Hero';
  private readonly view = 'emails/welcome_email';
  private readonly user: User;

  constructor(user: User) {
    super();
    this.user = user;
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    logger.info('Preparing to send welcome email to %s', this.user.email);

    this.message.to(this.user.email).htmlView(this.view, { user: this.user });
  }
}
