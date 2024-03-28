module.exports = {
    development: {
        dialect: "sqlite",
        storage: "./db.development.sqlite",
        seederStorage: "sequelize",
        underscored: true,
        logQueryParameters: true,
        //logging: console.log,
    },
    test: {
        dialect: "sqlite",
        //storage: './db.test.sqlite',
        storage: ':memory:',
        underscored: true,
        logQueryParameters: true,
        //logging: console.log,
        logging: false
    },
};
