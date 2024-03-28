import {
  factory,
} from '../../test_helpers';
import ServiceProviders from '../../models/service_providers';
import Activities from '../../models/activities';
import Reimbursements from '../../models/reimbursements';
import 'should';

const service_provider_id = 111;
const member_id = 211;
const activity_id = 311;
const reimbursement_id = 411;

describe('reimbursements Model', () => {
  it('creates row', async () => {
    // constraints are false or this wouldn't be possible
    await factory.createMany('reimbursements', 1, {
      reimbursement_id,
      service_provider_id,
    });
    const reimbursement = await Reimbursements.findByPk(reimbursement_id);
    reimbursement!.reimbursement_id!.should.eql(reimbursement_id);
  });

  it('belongsTo service_provider', async () => {
    await factory.createMany('service_providers', 1, {
      service_provider_id,
    });
    await factory.createMany('reimbursements', 1, {
      reimbursement_id,
      service_provider_id,
    });
    const reimbursement = await Reimbursements.findByPk(reimbursement_id, {
      include: [ ServiceProviders ],
    });
    reimbursement!.reimbursement_id!.should.eql(reimbursement_id);
    reimbursement!.service_provider!.service_provider_id!.should.eql(service_provider_id);
  });

  it('hasMany activities', async () => {
    await factory.createMany('activities', 1, {
      activity_id,
      service_provider_id,
      member_id,
      reimbursement_id,
    });
    await factory.createMany('reimbursements', 1, {
      reimbursement_id,
      service_provider_id,
    });
    const reimbursement = await Reimbursements.findByPk(reimbursement_id, {
      include: [ Activities ],
    });
    reimbursement!.reimbursement_id!.should.eql(reimbursement_id);
    reimbursement!.activities!.length.should.eql(1);
    reimbursement!.activities![0]!.activity_id!.should.eql(activity_id);
  });
});
