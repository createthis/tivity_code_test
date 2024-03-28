import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import Models from './models';
//import ServiceProviders from './models/service_providers';

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
