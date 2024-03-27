import { faker } from '@faker-js/faker';
import Activities from '../../models/activities';

enum activity_type {
  Activity = 'activity',
  Adjustment = 'adjustment',
}
/* eslint-disable-next-line  @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars */
export default function (factory: any, Models: any) {
  factory.define('activities', Activities, {
    activity_id: factory.sequence('activities.activity_id', (n: number) => `${n}`),
    member_id: factory.sequence('activities.member_id', (n: number) => `${n}`),
    reimbursement_id: null,
    parent_activity_id: null,
    description: faker.lorem.sentence,
    value: faker.finance.amount,
    activity_type: () => faker.helpers.enumValue(activity_type),
    created_at: () => new Date(),
  });
}
