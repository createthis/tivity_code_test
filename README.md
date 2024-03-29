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

### getServiceProviderJWT
```bash
curl -X GET http://localhost:3000/dev/service_provider/1/jwt \
  -H 'Content-Type: application/json'
```

### registerServiceProviderMembers
```bash
curl -X POST http://localhost:3000/dev/service_provider/members \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -d '{"members": [{"name": "John Doe", "registration_date": "2024-01-01T00:00:00Z"}]}'
```

### submitServiceProviderActivity
```bash
curl -X POST http://localhost:3000/dev/service_provider/activity \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -d '{"activities": [{"member_id": 1, "activity_date": "2024-02-01T00:00:00Z", "description": "Test Activity", "value": 100.00}]}'
```

### reimburseServiceProviders
```bash
curl -X POST http://localhost:3000/dev/service_provider/reimburse
```

### queryReimbursementStatus

DATETIME should be given in UTC, like 2024-03-28T23:24:11.666

```bash
curl -X GET http://localhost:3000/dev/service_provider/reimbursement/DATETIME \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

### GraphQL endpoint
We can also use GraphQL to access our data.

#### Query Reimbursements
```graphql
{
  serviceProviderReimbursementStatus(datetime: "2024-03-28T23:24:11.666") {
    reimbursement_id
    cycle_start_date
    cycle_end_date
    total_activity_value
    reimbursed_amount
    status
    processed_at
  }
}
```
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --data '{"query": "query { serviceProviderReimbursementStatus(datetime: \"2024-03-28T23:24:11.666\") { reimbursement_id cycle_start_date cycle_end_date total_activity_value reimbursed_amount status processed_at } }"}' \
  http://localhost:3000/graphql
```

## create migrations
Migrations are used as change control on the database.

```bash
./node_modules/.bin/sequelize-cli migration:create --name create_service_providers
```

Then you need to edit the file in the `/migrations` directory to flesh out the migration.

An example can be found at `migrations/20240328170544-create_service_providers.js`
