import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import Models from './models';
import jwt from 'jsonwebtoken';
import {Op} from 'sequelize';
import moment from 'moment';

export const registerServiceProvider: APIGatewayProxyHandler = async (event) => {
  try {
    const { name, reimbursement_percentage, reimbursement_cadence } = JSON.parse(event.body);

    const serviceProvider = await Models.service_providers.create({
      name,
      reimbursement_percentage,
      reimbursement_cadence,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'ServiceProvider registered successfully',
        serviceProvider,
      }),
    };
  } catch (error) {
    console.error('Error registering service provider:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
      }),
    };
  }
};

export const getJWT: APIGatewayProxyHandler = async (event) => {
  try {
    const { service_provider_id } = event.pathParameters;
    const token = jwt.sign({ service_provider_id }, process.env.PRIVATE_KEY);
    return token;
  } catch (error) {
    console.error(`Error signing JWT for service_provider_id=${event.pathParameters.service_provider_id}`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
      }),
    };
  }
}

const getServiceProviderIdFromToken = (token: string): number => {
  // Decode the JWT to extract the service_provider_id
  // This is a simplified example. In production, you should verify the token's signature and handle errors.
  const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
  return decoded.service_provider_id;
};

export const registerServiceProviderMembers: APIGatewayProxyHandler = async (event) => {
  try {
    const token = event.headers.Authorization || event.headers.authorization;
    const service_provider_id = getServiceProviderIdFromToken(token.replace('Bearer ', ''));

    // TODO: make sure service_provider_id exists here

    const { members } = JSON.parse(event.body);

    const createdMembers = await Promise.all(members.map(async (member) => {
      return await Models.members.create({
        ...member,
        service_provider_id,
        status: 'active', // Assuming all new members are active
      });
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        members: createdMembers.map(member => ({
          member_id: member.member_id,
          name: member.name,
          registration_date: member.registration_date,
          created_at: member.created_at,
          removed_at: member.removed_at,
        })),
      }),
    };
  } catch (error) {
    console.error('Error registering service provider members:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
      }),
    };
  }
};

export const submitServiceProviderActivity: APIGatewayProxyHandler = async (event) => {
  try {
    const token = event.headers.Authorization || event.headers.authorization;
    const service_provider_id = getServiceProviderIdFromToken(token.replace('Bearer ', ''));

    // TODO: verify that the service_provider_id has the right to add activities for the provided member_id(s)

    const { activities } = JSON.parse(event.body);

    const createdActivities = await Promise.all(activities.map(async (activity) => {
      // Assuming all activities submitted are of type 'activity'
      return await Models.activities.create({
        ...activity,
        activity_type: 'activity',
      });
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({
        activities: createdActivities.map(activity => ({
          activity_id: activity.activity_id,
          member_id: activity.member_id,
          activity_date: activity.activity_date,
          description: activity.description,
          value: activity.value,
        })),
      }),
    };
  } catch (error) {
    console.error('Error submitting service provider activity:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
      }),
    };
  }
};

export const reimburseServiceProviders: APIGatewayProxyHandler = async () => {
  try {
    const serviceProviders = await Models.service_providers.findAll();

    for (const serviceProvider of serviceProviders) {
      // Find all activities for the serviceProvider that have not been reimbursed
      const activities = await Models.activities.findAll({
        include: [{
          model: Models.members,
          required: true,
          where: { service_provider_id: serviceProvider.service_provider_id },
        }],
        where: {
          reimbursement_id: { [Op.is]: null },
        },
      });

      if (activities.length > 0) {
        // Calculate the total activity value
        const total_activity_value = activities.reduce((sum, activity) => sum + parseFloat(activity.value), 0);

        // Calculate the reimbursed amount
        const reimbursed_amount = total_activity_value * (serviceProvider.reimbursement_percentage / 100);

        console.log('total_activity_value=', total_activity_value, ', reimbursed_amount=', reimbursed_amount);

        // Insert a reimbursements record
        await Models.reimbursements.create({
          service_provider_id: serviceProvider.service_provider_id,
          cycle_start_date: new Date(), // Set appropriate cycle dates
          cycle_end_date: new Date(), // Set appropriate cycle dates
          total_activity_value,
          reimbursed_amount,
          status: 'pending',
        });

        // Update activities with the reimbursement_id if necessary
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Reimbursements processed successfully",
      }),
    };
  } catch (error) {
    console.error('Error processing reimbursements:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
      }),
    };
  }
};

export const queryReimbursementStatus: APIGatewayProxyHandler = async (event) => {
  try {
    const token = event.headers.Authorization || event.headers.authorization;
    const service_provider_id = getServiceProviderIdFromToken(token.replace('Bearer ', ''));

    const datetime = event.pathParameters.datetime;
    const cycleDate = moment.utc(datetime).toDate();

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
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'No reimbursement found for the given datetime',
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        reimbursement_id: reimbursement.reimbursement_id,
        cycle_start_date: reimbursement.cycle_start_date,
        cycle_end_date: reimbursement.cycle_end_date,
        total_activity_value: reimbursement.total_activity_value,
        reimbursed_amount: reimbursement.reimbursed_amount,
        status: reimbursement.status,
        processed_at: reimbursement.processed_at,
      }),
    };
  } catch (error) {
    console.error('Error querying reimbursement status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
      }),
    };
  }
};
