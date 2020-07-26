
exports.up = function(knex) {
  knex.schema.createTable('users', (table)=>{
      table.string('userid')
      table.string('username')
      table.text('password')
      table.integer('score')
      table.string('lasttime')
  })
};

exports.down = function(knex) {
  
};
