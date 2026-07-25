export async function up(knex) {
  await knex.schema.createTable('users', table => {
    table.increments('id')
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.string('role').notNullable()
    table.timestamp('created_date').defaultTo(knex.fn.now())
    table.timestamp('updated_date')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('users')
}
