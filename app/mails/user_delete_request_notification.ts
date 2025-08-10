import logger from '@adonisjs/core/services/logger';
import { BaseMail } from '@adonisjs/mail';
import User from '../models/user.js';

export default class UserDeleteRequestNotification extends BaseMail {
  public readonly subject = 'Biz Hero Account Deletion Request Received';
  private readonly view = 'emails/user_delete_request';
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
    logger.info('Preparing to send account deletion request to %s', this.user.email);

    this.message.to(this.user.email).htmlView(this.view, { user: this.user });
  }
}
