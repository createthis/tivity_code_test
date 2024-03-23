import fs from 'fs';
import path from 'path';
import { Sequelize, Model } from 'sequelize-typescript';
require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'development';
let config = require('../config/config').default[NODE_ENV];
let sequelize;
interface DbSingleton {
  sequelize: any;
}

if (NODE_ENV === 'test' && process.env.DATABASE_URL) {
  // Paranoia 1: prevent `npm test` from blowing away your production db
  console.log('env test so ignoring DATABASE_URL');
} else if (config.dialect && process.env.DATABASE_URL) {
  // Paranoia 2: prevent `npm test` from blowing away your production db
  console.log(`config.ts dialect set for env: ${NODE_ENV} so ignoring DATABASE_URL`);
}
if (!config.dialect && NODE_ENV !== 'test' && process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, config);
} else if (NODE_ENV === 'test' && process.env.TEST_MYSQL) {
  config = require('../config/config').default.test_mysql;
  sequelize = new Sequelize(config.database, config.username, config.password, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.ts'))
  .forEach((file) => {
    const modelObject = require(path.join(__dirname, file));
    sequelize.addModels([modelObject.default]);
  });

let db: DbSingleton = {
  sequelize,
};

// ------------
// Associations
// ------------
/*
db.companies.belongsTo(db.industries, {
  foreignKey: 'industry_id',
  targetKey: 'id',
  constraints: false,
});
*/

export default db;
