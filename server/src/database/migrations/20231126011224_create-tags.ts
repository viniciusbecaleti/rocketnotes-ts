import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tags', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table.string('name').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())

    table
      .uuid('note_id')
      .references('id')
      .inTable('notes')
      .notNullable()
      .onDelete('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tags')
}
