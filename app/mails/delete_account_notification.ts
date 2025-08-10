import logger from '@adonisjs/core/services/logger';
import { BaseMail } from '@adonisjs/mail';

export default class DeleteAccountNotification extends BaseMail {
  public readonly subject = ' Your Biz Hero Account Deletion Confirmation';
  private readonly view = 'emails/delete_account';

  constructor(
    private readonly email: string,
    private readonly fullName: string,
  ) {
    super();
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    logger.info('Preparing to send verification email to %s', this.email);

    this.message.to(this.email).htmlView(this.view, { fullName: this.fullName, email: this.email });
  }
}
