export async function up(knex) {
  await knex.schema.alterTable('modules', table => {
    table.boolean('is_locked').notNullable().defaultTo(true);
  });
}

export async function down(knex) {
  await knex.schema.alterTable('modules', table => {
    table.dropColumn('is_locked');
  });
}
