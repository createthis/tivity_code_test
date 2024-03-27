import {
  factory,
} from '../../test_helpers';
import Member from '../../models/members';
import Activities from '../../models/activities';
import 'should';

const service_provider_id = 111;
const member_id = 211;
const activity_id = 311;

describe('activities Model', () => {
  it('creates row', async () => {
    // constraints are false or this wouldn't be possible
    await factory.createMany('activities', 1, {
      activity_id,
      service_provider_id,
      member_id,
    });
    const activity = await Activities.findByPk(activity_id);
    activity!.activity_id!.should.eql(activity_id);
  });

  it('belongsTo member', async () => {
    await factory.createMany('service_providers', 1, {
      service_provider_id,
    });
    await factory.createMany('members', 1, {
      service_provider_id,
      member_id,
    });
    await factory.createMany('activities', 1, {
      activity_id,
      service_provider_id,
      member_id,
    });
    const activity = await Activities.findByPk(activity_id, {
      include: [ Member ],
    });
    activity!.activity_id!.should.eql(activity_id);
    activity!.member!.member_id!.should.eql(member_id);
  });
});
