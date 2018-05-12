// @flow

import { GraphQLFloat, GraphQLObjectType } from 'graphql';

export default new GraphQLObjectType({
  name: 'GeoLocation',
  fields: {
    latitude: {
      type: GraphQLFloat,
      resolve: _ => _.get('latitude'),
    },
    longitude: {
      type: GraphQLFloat,
      resolve: _ => _.get('longitude'),
    },
  },
});
