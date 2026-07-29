export async function up(knex) {
  return knex.schema.createTable('donations', (table) => {
    table.increments('id').primary()
    table.integer('user_id').unsigned().notNullable()
    table.string('account_name', 120).notNullable()
    table.string('bank_name', 80).notNullable()
    table.string('source_bank', 80).notNullable()
    table.integer('amount').notNullable()
    table.string('proof_image', 255)
    table.integer('is_verified').defaultTo(0)
    table.string('reject_reason', 255)
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('donations')
}
