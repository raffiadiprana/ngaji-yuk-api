export async function up(knex) {
  await knex.schema.alterTable('modules', table => {
    table.text('arabic_text').nullable();
    table.string('transliteration', 255).nullable();
    table.text('meaning').nullable();
    table.boolean('ghunnah').notNullable().defaultTo(false);
    table.integer('duration').notNullable().defaultTo(2); // harakat beats
    table.integer('is_draft').notNullable().defaultTo(0);
  });
}

export async function down(knex) {
  await knex.schema.alterTable('modules', table => {
    table.dropColumn('arabic_text');
    table.dropColumn('transliteration');
    table.dropColumn('meaning');
    table.dropColumn('ghunnah');
    table.dropColumn('duration');
    table.dropColumn('is_draft');
  });
}
