// @flow

import { GraphQLBoolean, GraphQLInt, GraphQLObjectType } from 'graphql';

export default new GraphQLObjectType({
  name: 'MenuItemPriceRules',
  fields: {
    mustChooseSize: {
      type: GraphQLBoolean,
      resolve: _ => _.get('mustChooseSize'),
    },
    mustChooseDietaryOption: {
      type: GraphQLBoolean,
      resolve: _ => _.get('mustChooseDietaryOption'),
    },
    minNumberOfSideDishes: {
      type: GraphQLInt,
      resolve: _ => _.get('minNumberOfSideDishes'),
    },
    maxNumberOfSideDishes: {
      type: GraphQLInt,
      resolve: _ => _.get('maxNumberOfSideDishes'),
    },
  },
});
