export async function up(knex) {
  await knex.schema.createTable('sections', table => {
    table.increments('id')
    table.string('section_name').notNullable()
  })
}

export async function down(knex) {
  await knex.schema.dropTable('sections')
}
