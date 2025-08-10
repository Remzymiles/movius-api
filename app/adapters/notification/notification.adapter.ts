import { AdapterManagement } from '#adapters/adapter.interface'
import NotificationSubscriber from '#models/notification_subscriber'
import { inject } from '@adonisjs/core'
import logger from '@adonisjs/core/services/logger'
import { Notification } from '@notifee/react-native'
import InternalServerErrorException from '../../exceptions/internal_server_error_exception.js'
import {
  NotificationSubscriber as INotificationSubscriber,
  NotificationManagement,
} from './notification.interface.js'
import { NovuAdapter } from './providers/novu/novu.adapter.js'
import { NovuConfig } from './providers/novu/novu.interface.js'
import { FirebaseAdapter } from './providers/pushNotification/firebase/firebase.adapter.js'

@inject()
export class NotificationAdapter implements AdapterManagement<NotificationManagement> {
  public readonly messagePayload?: Record<string, any>

  constructor(
    public readonly pushNotificationAdapter: FirebaseAdapter,
    public readonly adapter: NovuAdapter<NovuConfig>
  ) {}

  async sendMail(
    to: string,
    subject: string,
    message: string,
    config?: NovuConfig
  ): Promise<boolean> {
    if (this.adapter.sendMail) {
      return this.adapter.sendMail(to, subject, message, config)
    } else {
      logger.error(`The configured notification adapter cannot send mail`)
      throw new InternalServerErrorException(
        'Error occurred, system cannot send mail at the moment'
      )
    }
  }

  async createSubscriber(data: INotificationSubscriber): Promise<string | undefined> {
    if (this.adapter.createSubscriber) {
      const subscriberId = await this.adapter.createSubscriber(data)

      await NotificationSubscriber.create({
        user_id: data.user_id,
        subscriber_id: subscriberId,
      })

      return subscriberId
    } else {
      logger.error(`The configured notification adapter cannot create notification subscriber`)
    }
  }

  async createSubscribeList(title: string): Promise<boolean> {
    if (this.adapter.createSubscribeList) {
      return this.adapter.createSubscribeList(title)
    } else {
      logger.error(`The configured notification adapter cannot create notification subscriber list`)
      return false
    }
  }

  async updateSubscriber(data: INotificationSubscriber): Promise<boolean> {
    if (this.adapter.updateSubscriber) {
      return this.adapter.updateSubscriber(data)
    } else {
      logger.error(`The configured notification adapter cannot create update subscriber`)
      return false
    }
  }

  async addSubscriberToList(subscriberId: string[], listKey: string): Promise<boolean> {
    if (this.adapter.addSubscriberToList) {
      return this.adapter.addSubscriberToList(subscriberId, listKey)
    } else {
      logger.error(`The configured notification adapter does not support subscriber`)
      return false
    }
  }

  async getSubscribers(): Promise<boolean> {
    return (this.adapter as any).getSubscribers()
  }

  async sendPushNotification(tokens: string[], notification: Notification) {
    return this.pushNotificationAdapter.sendPushNotification(tokens, notification)
  }
}
