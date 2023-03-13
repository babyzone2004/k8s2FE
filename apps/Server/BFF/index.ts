import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import dataSources from './dataSources';
import buildSchema from './buildSchema';

async function bootstrap () {
  const schema = await buildSchema;
  // Create GraphQL server
  const server = new ApolloServer({
    schema,
    dataSources,
    context: ({ req }) => ({
      customHeaders: {
        headers: {
          'x-request-id': req.headers['x-request-id']
        },
      },
    }),
  });
  // Start the server
  const { url } = await server.listen({
    port: 8099,
    host: process.env.MODE === 'development' ? '127.0.0.1' : '0.0.0.0'
  });
  console.log(`Server is running, GraphQL Playground available at ${url}`);
}

bootstrap();
