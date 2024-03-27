import {
  factory,
} from '../../test_helpers';
import ServiceProvider from '../../models/service_providers';
import 'should';

const provider_id = 111;

describe('service_providers Model', () => {
  it('creates row', async () => {
    await factory.createMany('service_providers', 1, {
      provider_id,
    });
    const service_providers = await ServiceProvider.findAll();
    service_providers.length.should.eql(1);
  });
});
