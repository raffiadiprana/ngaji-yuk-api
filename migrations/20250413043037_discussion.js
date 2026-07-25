export async function up(knex) {
  await knex.schema.createTable('discussion', table => {
    table.increments('id')
    table.integer('modules_id').notNullable()
    table.integer('parent_id')
    table.integer('user_id').notNullable()
    table.text('content').notNullable()
    table.timestamp('created_date').defaultTo(knex.fn.now())
    table.timestamp('updated_date')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('discussion')
}
