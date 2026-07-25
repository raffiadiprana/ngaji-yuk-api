export async function up(knex) {
  await knex.schema.createTable('modules', table => {
    table.increments('id')
    table.string('title').notNullable()
    table.string('description')
    table.string('video_header_id')
    table.string('thumbnail')
    table.integer('section_id').notNullable()
    table.string('instructor_id').notNullable()
    table.timestamp('created_date').defaultTo(knex.fn.now())
    table.timestamp('updated_date')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('modules')
}
