// @flow

import { GraphQLString, GraphQLObjectType } from 'graphql';

export default new GraphQLObjectType({
  name: 'Phone',
  fields: {
    label: {
      type: GraphQLString,
      resolve: _ => _.get('label'),
    },
    number: {
      type: GraphQLString,
      resolve: _ => _.get('number'),
    },
  },
});
