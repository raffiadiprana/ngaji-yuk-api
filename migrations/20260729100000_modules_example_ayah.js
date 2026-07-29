'use strict';

module.exports = {
  up: async ( knex ) => {
    await knex.schema.alterTable( 'modules', ( table ) => {
      table.text( 'marked_ayah' ).nullable();
      table.jsonb( 'highlight_words' ).nullable();
    } );
  },

  down: async ( knex ) => {
    await knex.schema.alterTable( 'modules', ( table ) => {
      table.dropColumn( 'marked_ayah' );
      table.dropColumn( 'highlight_words' );
    } );
  }
};
