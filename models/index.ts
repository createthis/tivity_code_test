import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
dotenv.config();
import configRoot from '../config/config';

const NODE_ENV = process.env.NODE_ENV || 'development';
let config = configRoot[NODE_ENV];
let sequelize;
interface DbSingleton {
  sequelize: Sequelize;
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
  config = configRoot.test_mysql;
  if (!config.database) throw new Error('missing database in config');
  if (!config.username) throw new Error('missing username in config');
  sequelize = new Sequelize(config.database, config.username, config.password, config);
} else {
  sequelize = new Sequelize(config.database || '', config.username || '', config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.ts'))
  .forEach((file) => {
    /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    const modelObject = require(path.join(__dirname, file));
    sequelize.addModels([modelObject.default]);
  });

const db: DbSingleton = {
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
