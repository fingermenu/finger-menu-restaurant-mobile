// @flow

import { GraphQLString, GraphQLObjectType, GraphQLNonNull } from 'graphql';

export default new GraphQLObjectType({
  name: 'DocumentTemplate',
  fields: {
    name: {
      type: GraphQLString,
      resolve: _ => _.get('name'),
    },
    template: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: _ => _.get('template'),
    },
  },
});
