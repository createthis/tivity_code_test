import { faker } from '@faker-js/faker';
import Member from '../../models/members';

enum member_status {
  Active = 'active',
  Removed = 'removed',
}
/* eslint-disable-next-line  @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars */
export default function (factory: any, Models: any) {
  factory.define('members', Member, {
    member_id: factory.sequence('members.member_id', (n: number) => `${n}`),
    service_provider_id: factory.sequence('service_providers.service_provider_id', (n: number) => `${n}`),
    name: faker.company.name,
    status: () => faker.helpers.enumValue(member_status),
    registration_date: () => new Date(),
    created_at: () => new Date(),
    removed_at: null,
  });
}
