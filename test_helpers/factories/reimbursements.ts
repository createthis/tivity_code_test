import { faker } from '@faker-js/faker';
import Reimbursements from '../../models/reimbursements';

enum reimbursement_status {
  Pending = 'pending',
  Processed = 'processed',
}
/* eslint-disable-next-line  @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars */
export default function (factory: any, Models: any) {
  factory.define('reimbursements', Reimbursements, {
    reimbursement_id: factory.sequence('reimbursements.reimbursement_id', (n: number) => `${n}`),
    service_provider_id: factory.sequence('reimbursements.service_provider_id', (n: number) => `${n}`),
    cycle_start_date: () => new Date(),
    cycle_end_date: () => new Date(),
    total_activity_value: faker.finance.amount,
    reimbursed_amount: faker.finance.amount,
    status: () => faker.helpers.enumValue(reimbursement_status),
    created_at: () => new Date(),
    processed_at: () => new Date(),
  });
}
