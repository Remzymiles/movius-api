import { cuid } from '@adonisjs/core/helpers';
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import type { IBaseModel } from '../../interfaces/model.interface.js';

export default class LoginDevice extends BaseModel {
  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare cuid: string;

  @column()
  declare user_id: number;

  @column()
  declare os: string;

  @column()
  declare os_version: string;

  @column()
  declare client: string;

  @column()
  declare client_version: string;

  @column()
  declare device_type: string;

  @column()
  declare device_brand: string;

  @column()
  declare device_model: string;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @beforeCreate()
  static async addCuid(data: IBaseModel) {
    data.cuid = cuid();
  }
}
