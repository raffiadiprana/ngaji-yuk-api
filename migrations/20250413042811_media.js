export async function up(knex) {
  await knex.schema.createTable('media', table => {
    table.increments('id')
    table.integer('parent_id')
    table.string('url').notNullable()
    table.string('thumbnail').notNullable()
    table.timestamp('created_date').defaultTo(knex.fn.now())
    table.timestamp('updated_date')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('media')
}
