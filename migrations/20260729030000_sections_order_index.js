export async function up(knex) {
  await knex.schema.alterTable('sections', table => {
    table.integer('order_index').notNullable().defaultTo(0);
  });
  // Set Makhraj (id 9) ke urutan 0 (paling atas), sisanya urut by id
  await knex('sections').where({ id: 9 }).update({ order_index: 0 });
  await knex('sections').where('id', '!=', 9).update({ order_index: knex.raw('id') });
}

export async function down(knex) {
  await knex.schema.alterTable('sections', table => {
    table.dropColumn('order_index');
  });
}
