export async function up(knex) {
  await knex.schema.alterTable('modules', table => {
    table.text('marked_ayah').nullable();
    table.jsonb('highlight_words').nullable();
    table.string('voice_note_url').nullable();
  });
}

export async function down(knex) {
  await knex.schema.alterTable('modules', table => {
    table.dropColumn('marked_ayah');
    table.dropColumn('highlight_words');
    table.dropColumn('voice_note_url');
  });
}
