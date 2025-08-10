import { cuid } from '@adonisjs/core/helpers';
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import type { IBaseModel } from '../../interfaces/model.interface.js';

export default class AccountVerificationToken extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare cuid: string;

  @column({ serializeAs: null })
  declare token: string;

  @column()
  declare user_id: number;

  @column()
  declare used: boolean;

  @column.dateTime()
  declare expiration_time: DateTime;

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime;

  @beforeCreate()
  static async addCuid(data: IBaseModel) {
    data.cuid = cuid();
  }
}
