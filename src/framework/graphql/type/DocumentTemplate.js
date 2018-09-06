// @flow

import { GraphQLFloat, GraphQLString, GraphQLObjectType, GraphQLNonNull } from 'graphql';

export default new GraphQLObjectType({
  name: 'DocumentTemplate',
  fields: {
    name: {
      type: GraphQLString,
      resolve: _ => _.get('name'),
    },
    maxLineWidthDivisionFactor: {
      type: GraphQLFloat,
      resolve: _ => {
        const maxLineWidthDivisionFactor = _.get('maxLineWidthDivisionFactor');

        return maxLineWidthDivisionFactor ? maxLineWidthDivisionFactor : 1.0;
      },
    },
    template: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: _ => _.get('template'),
    },
  },
});
