// @flow

import { GraphQLInt, GraphQLString, GraphQLObjectType } from 'graphql';

export default new GraphQLObjectType({
  name: 'Printer',
  fields: {
    name: {
      type: GraphQLString,
      resolve: _ => _.get('name'),
    },
    type: {
      type: GraphQLString,
      resolve: _ => _.get('type'),
    },
    hostname: {
      type: GraphQLString,
      resolve: _ => _.get('hostname'),
    },
    port: {
      type: GraphQLInt,
      resolve: _ => _.get('port'),
    },
  },
});
