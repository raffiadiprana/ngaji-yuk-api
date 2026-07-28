export async function up(knex) {
  await knex.schema.alterTable('quiz', table => {
    table.integer('instructor_id');
  });
}

export async function down(knex) {
  await knex.schema.alterTable('quiz', table => {
    table.dropColumn('instructor_id');
  });
}
