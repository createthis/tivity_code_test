import fs from 'fs';
import path from 'path';
import { Sequelize, ModelCtor, getOptions } from 'sequelize-typescript';
import dotenv from 'dotenv';
dotenv.config();
import configRoot from '../config/config';

const NODE_ENV = process.env.NODE_ENV || 'development';
let config = configRoot[NODE_ENV];
let sequelize;
type Models = {
  [key: string]: ModelCtor,
}
type DbSingleton = {
  sequelize: Sequelize,
}
type DbSingletonWithModels = DbSingleton & Partial<Models>
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

const db = {
  sequelize,
} as DbSingletonWithModels

const models: ModelCtor[] = [];
fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js') && (file !== 'index.ts') && !file.endsWith('.swp'))
  .forEach((file) => {
    const filePath = path.join(__dirname, file);
    console.log('filePath=', filePath);
    /* eslint-disable-next-line @typescript-eslint/no-var-requires */
    const modelObject = require(filePath);
    const model = modelObject.default;
    console.log('model=', model);
    console.log('model.prototype=', model.prototype);
    const options = getOptions(model.prototype);
    console.log('options=', options);
    const tableName: string = options!.tableName!;
    models.push(model);
    db[tableName] = model;
  });
sequelize.addModels(models);


// ------------
// Associations
// ------------
/*
db.service_providers.belongsTo(db.members, {
  foreignKey: 'service_provider_id', // member
  targetKey: 'service_provider_id', // service_provider
  constraints: false,
});
*/

export default db;
