import {
  factory,
} from '../../test_helpers';
import ServiceProviders from '../../models/service_providers';
import Member from '../../models/members';
import 'should';

const service_provider_id = 111;
const member_id = 211;

describe('members Model', () => {
  it('creates row', async () => {
    // constraints are false or this wouldn't be possible
    await factory.createMany('members', 1, {
      service_provider_id,
      member_id,
    });
    const member = await Member.findByPk(member_id);
    member!.service_provider_id!.should.eql(service_provider_id);
  });

  it('belongsTo service_provider', async () => {
    await factory.createMany('service_providers', 1, {
      service_provider_id,
    });
    await factory.createMany('members', 1, {
      service_provider_id,
      member_id,
    });
    const member = await Member.findByPk(member_id, {
      include: [ ServiceProviders ],
    });
    member!.service_provider_id!.should.eql(service_provider_id);
    member!.service_provider!.service_provider_id!.should.eql(service_provider_id);
  });
});
