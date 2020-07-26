
exports.up = function(knex) {
  knex.schema.table('users', table => {
      table.timestamp('lasttime').alter()
  })
};

exports.down = function(knex) {
  
};
