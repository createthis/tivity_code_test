import Models from '../models';
const factory_girl = require('factory-girl');
const adapter = new factory_girl.SequelizeAdapter();
let factory = factory_girl.factory;
factory.setAdapter(adapter);

// clean the factory state - necessary for mocha watch
factory.cleanUp();
factory.factories = [];

// define factories
const factories = require('./factories');
factories.default(factory, Models);

/* uncomment to see UnhandledPromiseRejectionWarning stack traces */
/*
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p);
  console.log('reason:', reason);
});
*/
/*
 * treat unhandledRejection as a test failure
 * see https://github.com/mochajs/mocha/issues/2640
 */
process.on('unhandledRejection', (reason, p) => {
  throw reason;
});

let skip_db_sync = false;

let set_skip_db_sync = (value: boolean) => {
  skip_db_sync = value;
}

let sync_list: any[] = [];

let flushPromises = () => {
  return new Promise(resolve => setImmediate(resolve));
}

let first_sync = true;

beforeEach(async function () {
  if (!skip_db_sync) {
    factory.resetSeq();
    if (first_sync) {
      await Models.sequelize.sync({force: true});
      first_sync = false;
    }

    if (sync_list.length !== 0 && !first_sync) {
      while (sync_list.length > 0) {
        const table = sync_list.pop();
        if (process.env.TEST_MYSQL) {
          await Models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        }
        try {
          //await Models[table].sync({force: true});
        } catch (e) {
          if (table === 'log_user_action') {
            console.log('sync table=',table,', error=',e);
          } else {
            throw e;
          }
        }
      }
      if (process.env.TEST_MYSQL) {
        await Models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      }
      sync_list = [];
    }
  }
});

afterEach(() => {
  set_skip_db_sync(false);
});

Models.sequelize.addHook('beforeCreate', (model: any, options: any) => {
  const table_name = model.constructor.options.tableName;
  if (sync_list.includes(table_name)) return;
  sync_list.push(table_name);
});

Models.sequelize.addHook('beforeBulkCreate', (models: any, options: any) => {
  for (const model of models) {
    const table_name = model.constructor.options.tableName;
    if (sync_list.includes(table_name)) return;
    sync_list.push(table_name);
  }
});

export {
  Models,
  factory,
  set_skip_db_sync,
  flushPromises,
}
