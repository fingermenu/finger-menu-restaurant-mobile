// @flow

import { GraphQLString, GraphQLObjectType } from 'graphql';

export default new GraphQLObjectType({
  name: 'RestaurantLanguages',
  fields: {
    defaultDisplay: {
      type: GraphQLString,
      resolve: _ => _.get('defaultDisplay'),
    },
    printOnCustomerReceipt: {
      type: GraphQLString,
      resolve: _ => _.get('printOnCustomerReceipt'),
    },
    printOnKitchenReceipt: {
      type: GraphQLString,
      resolve: _ => _.get('printOnKitchenReceipt'),
    },
  },
});
