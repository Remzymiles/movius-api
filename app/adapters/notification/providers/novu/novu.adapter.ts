import env from '#start/env';
import { cuid } from '@adonisjs/core/helpers';
import logger from '@adonisjs/core/services/logger';
import { Novu } from '@novu/node';
import { NotificationManagement, NotificationSubscriber } from '../../notification.interface.js';
import { NovuBuildMessage, NovuConfig } from './novu.interface.js';

export class NovuAdapter<T extends NovuConfig> extends Novu implements NotificationManagement<T> {
  constructor() {
    const token = env.get('EMAIL_PROVIDER_TOKEN');
    super(token);
  }

  async sendMail(to: string, subject: string, message: string | Record<string, any>, config?: T): Promise<boolean> {
    logger.info('Sending email using Novu as Provider', 'NovuAdapter.sendMail');

    try {
      await this.trigger('general-email-notification', {
        to: {
          subscriberId: config?.subscriberId as any,
          email: to,
        },
        payload: {
          message,
          subject,
        },
      });

      logger.info('Sent email using Novu as Provider', 'NovuAdapter.sendMail');

      return true;
    } catch (e) {
      console.log(e);
      logger.error(e.message, 'NovuAdapter.sendMail');
    }

    return false;
  }

  public async createSubscriber(data: NotificationSubscriber): Promise<string | undefined> {
    logger.info('Creating subscriber using Novu as Provider', 'NovuAdapter.createSubscriber');

    const [firstName, lastName] = data.full_name?.split(' ') || [];
    try {
      const response = await this.subscribers.identify(data.user_uuid, {
        email: data.email,
        avatar: data.avatar,
        firstName,
        lastName,
        phone: data.phone,
      });

      logger.warn('Created subscriber using Novu as Provider', 'NovuAdapter.createSubscriber');

      return response.data.data.subscriberId;
    } catch (e) {
      logger.error(e.message, 'NovuAdapter.createSubscriber');
    }
  }

  public async updateSubscriber(data: NotificationSubscriber): Promise<boolean> {
    try {
      await this.subscribers.update(data.subscriberId as string, {
        email: data.email,
        avatar: data.avatar,
        firstName: data.full_name,
        lastName: data.last_name,
        phone: data.phone,
      });
      return true;
    } catch (e) {
      logger.error(e.message, 'NovuAdapter.createSubscriber');
    }

    return false;
  }

  public async createSubscribeList(title: string): Promise<boolean> {
    try {
      await this.topics.create({
        key: cuid(),
        name: title,
      });
      return true;
    } catch (e) {
      logger.error(e.message, 'NovuAdapter.createSubscribeList');
    }

    return false;
  }

  public async addSubscriberToList(subscriberId: string[], listKey: string): Promise<boolean> {
    try {
      await this.topics.addSubscribers(listKey, {
        subscribers: subscriberId,
      });
      return true;
    } catch (e) {
      logger.error(e.message, 'NovuAdapter.createSubscribeList');
    }

    return false;
  }

  async notify<T = NovuBuildMessage>(data: T | NovuBuildMessage): Promise<boolean> {
    logger.warn('Creating subscriber using Novu as Provider', 'NovuAdapter.buildMessage');
    data = data as NovuBuildMessage;
    try {
      await this.trigger(data.eventName, data.payload);
      return true;
    } catch (e) {}

    return false;
  }

  static isActive() {
    return env.get('EMAIL_PROVIDER_NAME').toLowerCase() === 'novu';
  }
}
