import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('cuid').unique().notNullable()

      table.string('full_name').notNullable()
      table.string('phone').unique().nullable()
      table.string('email', 254).notNullable().unique()
      table.string('avatar_url').nullable()
      table.string('password').notNullable()
      table.boolean('is_active').defaultTo(false)
      table.boolean('is_email_verified').defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}