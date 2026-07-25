export async function up(knex) {
  await knex.schema.createTable('videologs', table => {
    table.increments('id')
    table.integer('parent_id').notNullable()
    table.integer('user_id')
    table.integer('last_position')
    table.integer('duration')
    table.integer('is_complete')
    table.timestamp('updated_date')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('videologs')
}
