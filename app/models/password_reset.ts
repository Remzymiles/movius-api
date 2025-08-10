import { cuid } from '@adonisjs/core/helpers';
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import type { IBaseModel } from '../../interfaces/model.interface.js';

export default class PasswordReset extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare cuid: string;

  @column()
  declare user_id: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @column()
  declare token: string;

  @column()
  declare is_used: boolean;

  @column.dateTime()
  declare expiration_time: DateTime;

  @beforeCreate()
  static async addCuid(data: IBaseModel) {
    data.cuid = cuid();
  }
}
