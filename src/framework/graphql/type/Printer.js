// @flow

import { GraphQLInt, GraphQLString, GraphQLObjectType, GraphQLNonNull } from 'graphql';

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
      type: new GraphQLNonNull(GraphQLString),
      resolve: _ => _.get('hostname'),
    },
    port: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: _ => _.get('port'),
    },
    maxLineWidth: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: _ => _.get('maxLineWidth'),
    },
  },
});
