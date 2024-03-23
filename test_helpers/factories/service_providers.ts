import { faker } from '@faker-js/faker';
import ServiceProvider from '../../models/service_providers';

export default function (factory: any, Models: any) {
  factory.define('service_providers', ServiceProvider, {
    provider_id: factory.sequence('service_providers.provider_id', (n: number) => `${n}`),
    name: faker.company.name,
    registration_date: () => new Date(),
  });
};
