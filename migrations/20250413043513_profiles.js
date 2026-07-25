export async function up(knex) {
  await knex.schema.createTable('profiles', table => {
    table.increments('id')
    table.integer('user_id').notNullable()
    table.string('display_name').notNullable()
    table.string('jobtitle')
    table.string('tagline', 100)
    table.text('about_me')
    table.string('skills')
    table.string('avatar')
    table.timestamp('created_date').defaultTo(knex.fn.now())
    table.timestamp('updated_date')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('profiles')
}
