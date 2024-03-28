# tivity_code_test

## Getting Started
```bash
npm install
npm test
npm run reloadseed # create and populate development database with dummy data
npm run dev
```

## curl commands to test endpoints locally
### registerServiceProvider
```bash
curl -X POST http://localhost:3000/dev/service_provider \
  -H 'Content-Type: application/json' \
  -d '{"name": "Example Name", "reimbursement_percentage": 20.5, "reimbursement_cadence": "monthly"}'
```

## create migrations
Migrations are used as change control on the database.

```bash
./node_modules/.bin/sequelize-cli migration:create --name create_service_providers
```

Then you need to edit the file in the `/migrations` directory to flesh out the migration.

An example can be found at `migrations/20240328170544-create_service_providers.js`
