export async function up(knex) {
  // A. Tambah kategori + urutan ke tabel modules
  await knex.schema.alterTable('modules', table => {
    table.string('category', 20).notNullable().defaultTo('core');
    table.integer('order_index').notNullable().defaultTo(0);
  });

  // Tabel user_progress untuk snapshot progres santri per modul
  await knex.schema.createTable('user_progress', table => {
    table.increments('id');
    table.integer('user_id').notNullable();
    table.integer('module_id').notNullable();
    table.string('status', 20).notNullable().defaultTo('not_started'); // not_started | in_progress | completed
    table.integer('progress_percent').notNullable().defaultTo(0);
    table.timestamp('created_date').defaultTo(knex.fn.now());
    table.timestamp('updated_date');
    table.unique(['user_id', 'module_id']);
  });
}

export async function down(knex) {
  await knex.schema.alterTable('modules', table => {
    table.dropColumn('category');
    table.dropColumn('order_index');
  });
  await knex.schema.dropTable('user_progress');
}
