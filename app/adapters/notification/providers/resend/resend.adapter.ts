import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import { Resend } from 'resend'
import { NotificationManagement } from '../../notification.interface.js'

export class ResendAdapter extends Resend implements NotificationManagement {
  private from: string

  constructor() {
    //
    const token = env.get('EMAIL_PROVIDER_TOKEN')
    super(token)

    this.from = env.get('EMAIL_PROVIDER_FROM')
  }

  public async sendMail(to: string, subject: string, message: string): Promise<boolean> {
    logger.info('Sending email using Resend as Provider', 'ResendAdapter.sendMail')

    try {
      await this.emails.send({
        from: this.from,
        to,
        subject,
        html: message,
      })
      logger.info('Mail sent with Resend Provider', 'ResendAdapter.sendMail')

      return true
    } catch (e) {
      logger.error(e.message, 'ResendAdapter.sendMail')
    }
    return false
  }

  static isActive() {
    return env.get('EMAIL_PROVIDER_NAME').toLowerCase() === 'resend'
  }
}
