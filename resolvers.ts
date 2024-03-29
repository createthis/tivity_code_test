import Models from './models';
import {Op} from 'sequelize';
import moment from 'moment';


export const resolvers = {
  Query: {
    serviceProviderReimbursementStatus: async (root, args, context) => {
      const service_provider_id = context.service_provider_id;
      const { datetime } = args;

      const cycleDate = moment.utc(datetime).toDate();
      try {
        const reimbursement = await Models.reimbursements.findOne({
          where: {
            service_provider_id,
            cycle_start_date: {
              [Op.lte]: cycleDate,
            },
            cycle_end_date: {
              [Op.gte]: cycleDate,
            },
          },
        });

        if (!reimbursement) {
          throw new Error('No reimbursement found for the given datetime');
        }

        return reimbursement;
      } catch (error) {
        console.error('Error querying reimbursement status:', error);
        throw new Error('Internal server error');
      }
    },
  },
};
