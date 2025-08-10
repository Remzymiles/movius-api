import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import type { IBaseModel } from '../../interfaces/model.interface.js';
import { cuid } from '@adonisjs/core/helpers';

export default class NotificationSubscriber extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare cuid: string;

  @column()
  declare subscriber_id: string;

  @column()
  declare user_id: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @beforeCreate()
  static async addCuid(data: IBaseModel) {
    data.cuid = cuid();
  }
}
