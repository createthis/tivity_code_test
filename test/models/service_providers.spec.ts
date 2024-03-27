import {
  factory,
} from '../../test_helpers';
import ServiceProvider from '../../models/service_providers';
import Member from '../../models/members';
import 'should';

const service_provider_id = 111;
const member_id = 211;

describe('service_providers Model', () => {
  it('creates row', async () => {
    await factory.createMany('service_providers', 1, {
      service_provider_id,
    });
    const service_provider = await ServiceProvider.findByPk(service_provider_id);
    service_provider!.service_provider_id!.should.eql(service_provider_id);
  });

  it('hasMany members', async () => {
    await factory.createMany('service_providers', 1, {
      service_provider_id,
    });
    await factory.createMany('members', 1, {
      service_provider_id,
      member_id,
    });
    const service_provider = await ServiceProvider.findByPk(service_provider_id, {
      include: [ Member ],
    });
    service_provider!.service_provider_id!.should.eql(service_provider_id);
    service_provider!.members!.length.should.eql(1);
    service_provider!.members![0]!.member_id!.should.eql(member_id);
  });
});
