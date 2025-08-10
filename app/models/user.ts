import type { IBaseModel } from '#interfaces/model.interface'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose, cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, beforeCreate, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Role from './role.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email', 'id', 'cuid'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) implements IBaseModel {
  private static readonly loginSessionDuration = app.inDev ? '1000 days' : '4 hours'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cuid: string

  @column()
  declare public full_name: string

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare phone: string

  @column()
  declare avatar_url: string

  @column()
  declare credits: number

  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updated_at: DateTime | null

  @column()
  declare is_email_verified: boolean

  @column()
  declare is_active: boolean

  static readonly accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: User.loginSessionDuration,
    prefix: 'movius_',
  })

  @beforeCreate()
  static async addCuid(data: IBaseModel) {
    data.cuid = cuid()
  }

  @manyToMany(() => Role, {
    pivotTable: 'user_roles',
  })
  declare roles: ManyToMany<typeof Role>
}
