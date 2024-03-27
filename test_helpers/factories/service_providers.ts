import { faker } from '@faker-js/faker';
import ServiceProvider from '../../models/service_providers';

enum reimbursement_cadence {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
}
/* eslint-disable-next-line  @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars */
export default function (factory: any, Models: any) {
  factory.define('service_providers', ServiceProvider, {
    service_provider_id: factory.sequence('service_providers.service_provider_id', (n: number) => `${n}`),
    name: faker.company.name,
    reimbursement_cadence: () => faker.helpers.enumValue(reimbursement_cadence),
    reimbursement_percentage: faker.number.float,
    created_at: () => new Date(),
  });
}
