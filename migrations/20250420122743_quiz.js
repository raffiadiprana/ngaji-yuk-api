export async function up(knex) {
  await knex.schema.createTable('quiz', table => {
    table.increments('id')
    table.integer('modules_id').notNullable()
    table.string('type', 100).notNullable()
    table.text('question').notNullable()
    table.integer('media_id')
    table.string('answer_type', 50).notNullable()
    table.integer('is_completed').notNullable()
    table.timestamp('created_date').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_date')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('quiz')
}
