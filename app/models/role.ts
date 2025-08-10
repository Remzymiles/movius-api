import { cuid } from '@adonisjs/core/helpers'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { IBaseModel } from '../../interfaces/model.interface.js'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cuid: string

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare app_name: string

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime

  @beforeCreate()
  static async addCuid(data: IBaseModel) {
    data.cuid = cuid()
  }
}
