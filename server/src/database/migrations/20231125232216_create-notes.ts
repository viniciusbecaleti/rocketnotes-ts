import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('notes', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table.string('title').notNullable()
    table.string('description').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('notes')
}
