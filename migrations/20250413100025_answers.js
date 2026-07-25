export async function up(knex) {
  await knex.schema.createTable('answers', table => {
    table.increments('id')
    table.integer('quiz_id').notNullable()
    table.integer('user_id').notNullable()
    table.string('answer_type', 100).notNullable()
    table.text('answer_value').notNullable()
    table.integer('checked_by')
    table.integer('is_passed')
    table.integer('score')
    table.string('review_notes', 255)
    table.timestamp('created_date').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_date')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('answers')
}
