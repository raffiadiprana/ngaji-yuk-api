export async function up(knex) {
  await knex.schema.alterTable('answers', table => {
    table.integer('reply_to').nullable()
    table.integer('instructor_id').nullable()
  })
}

export async function down(knex) {
  await knex.schema.alterTable('answers', table => {
    table.dropColumn('reply_to')
    table.dropColumn('instructor_id')
  })
}
