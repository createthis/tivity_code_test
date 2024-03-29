import { ApolloServer } from '@apollo/server';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import jwt from 'jsonwebtoken';

type ContextValue = {
  service_provider_id?: number;
  isAuthenticated: boolean;
};

const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
});

const getServiceProviderIdFromToken = (authHeader) => {
  const token = authHeader.split(' ')[1]; // Assuming "Bearer TOKEN"
  const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
  return decoded.service_provider_id;
};

export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context: async ({ event }) => {
      // Do some parsing on the event (parse JWT, cookie, auth header, etc.)
      const service_provider_id = getServiceProviderIdFromToken(event.headers.authorization);
      return {
        isAuthenticated: true,
        service_provider_id,
      };
    },
  }
);
