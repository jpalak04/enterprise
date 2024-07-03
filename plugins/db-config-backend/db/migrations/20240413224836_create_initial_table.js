/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

// update the value of the configuration entry
exports.up = function(knex) {
        return knex.schema.createTable('dbconfig', function(table) {
            table.increments('sequence_id').primary();
            table.timestamp('timestamp').defaultTo(knex.fn.now());
            table.string('key').notNullable();
            table.string('value').nullable();
            table.jsonb('json_value').nullable();
        });
    };
    
    exports.down = function(knex) {
        return knex.schema.dropTable('dbconfig');
    };

