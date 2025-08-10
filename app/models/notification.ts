import { cuid } from '@adonisjs/core/helpers';
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import type { IBaseModel } from '../../interfaces/model.interface.js';

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare cuid: string;

  @column()
  declare user_id: number;

  @column()
  declare type: string;

  @column()
  declare title: string;

  @column()
  declare body: string;

  @column()
  declare is_read: boolean;

  @column()
  declare action_url: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @beforeCreate()
  static async addCuid(data: IBaseModel) {
    data.cuid = cuid();
  }
}
