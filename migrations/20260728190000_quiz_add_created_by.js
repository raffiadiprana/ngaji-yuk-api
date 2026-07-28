export async function up(knex) {
  // created_by tidak ada di tabel quiz (penyebab 422 saat santri Mulai Chat)
  const hasCreatedBy = await knex.schema.hasColumn('quiz', 'created_by');
  if (!hasCreatedBy) {
    await knex.schema.alterTable('quiz', table => {
      table.integer('created_by');
    });
  }

  // type & answer_type awalnya NOT NULL tapi chat bisa dibuat tanpa keduanya
  // Kita biarkan kolom ada, cukup pastikan frontend mengirim default.
  // (Tidak mengubah NOT NULL agar tidak merusak data existing.)
}

export async function down(knex) {
  const hasCreatedBy = await knex.schema.hasColumn('quiz', 'created_by');
  if (hasCreatedBy) {
    await knex.schema.alterTable('quiz', table => {
      table.dropColumn('created_by');
    });
  }
}
