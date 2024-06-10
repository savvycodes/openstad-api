var db = require('../src/db').sequelize;

/**
 *
 */
module.exports = {
  up: function () {
    try {
      return db.query(`
        ALTER TABLE \`events\`
          ADD COLUMN \`highlighted\` BOOL DEFAULT FALSE;
      `);
    } catch (e) {
      console.error('Migration:up failed:', e.message);s
      return true;
    }
  },
  down: function () {
    return db.query(`
        ALTER TABLE \`events\`
          DROP \`highlighted\`;
    `);
  },
};
