import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'logins'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('cuid').unique().notNullable()

      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()

      table
        .integer('login_location_id')
        .unsigned()
        .references('id')
        .inTable('login_locations')
        .onDelete('CASCADE')
        .nullable()

      table
        .integer('login_device_id')
        .unsigned()
        .references('id')
        .inTable('login_devices')
        .onDelete('CASCADE')
        .nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}