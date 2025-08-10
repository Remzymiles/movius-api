import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import type { IBaseModel } from '../../interfaces/model.interface.js';
import { cuid } from '@adonisjs/core/helpers';

export default class UserRole extends BaseModel {
  static table = 'user_roles';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare cuid: string;

  @column()
  declare user_id: number;

  @column()
  declare role_id: number;

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime;

  @beforeCreate()
  static async addCuid(data: IBaseModel) {
    data.cuid = cuid();
  }
}
