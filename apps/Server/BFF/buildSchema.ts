import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import resolvers from './resolvers';

export default buildSchema({
  resolvers,
  emitSchemaFile: true
});
