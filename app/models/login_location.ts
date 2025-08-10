import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import type { IBaseModel } from '../../interfaces/model.interface.js';
import { cuid } from '@adonisjs/core/helpers';

export default class LoginLocation extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare cuid: string;

  @column()
  declare user_id: number;

  @column()
  declare country: string;

  @column()
  declare latitude: string;

  @column()
  declare longitude: string;

  @column()
  declare ip_address: string;

  @column()
  declare region: string;

  @column()
  declare isp: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @beforeCreate()
  static async addCuid(data: IBaseModel) {
    data.cuid = cuid();
  }
}
