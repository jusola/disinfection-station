
exports.up = function(knex) {
  knex.schema.table('users', table => {
      table.time('lasttime').alter()
  })
};

exports.down = function(knex) {
  
};
