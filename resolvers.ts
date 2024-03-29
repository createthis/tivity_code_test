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
          include: [{
            model: Models.service_providers,
            required: true,
          }],
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
  Mutation: {
    registerServiceProviderMembers: async (root, args, context) => {
      const { members } = args;
      const service_provider_id = context.service_provider_id;

      // Assume validation of service_provider_id and members input occurs here

      try {
        // Create members in the database
        const createdMembers = await Promise.all(members.map(async (member) => {
          // Add logic to create each member in the database
          // This example assumes you have a function to create a member and return the created member object
          return await Models.members.create({
            ...member,
            service_provider_id,
            status: 'active', // Assuming all new members are active
          });
        }));

        return createdMembers;
      } catch (error) {
        console.error('Error registering service provider members:', error);
        throw new Error('Failed to register members');
      }
    },
  },
};
