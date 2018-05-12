// @flow

import { GraphQLString, GraphQLObjectType } from 'graphql';

export default new GraphQLObjectType({
  name: 'RestaurantImages',
  fields: {
    logoImageUrl: {
      type: GraphQLString,
      resolve: _ => _.get('logoImageUrl'),
    },
    primaryLandingPageBackgroundImageUrl: {
      type: GraphQLString,
      resolve: _ => _.get('primaryLandingPageBackgroundImageUrl'),
    },
    secondaryLandingPageBackgroundImageUrl: {
      type: GraphQLString,
      resolve: _ => _.get('secondaryLandingPageBackgroundImageUrl'),
    },
    primaryTopBannerImageUrl: {
      type: GraphQLString,
      resolve: _ => _.get('primaryTopBannerImageUrl'),
    },
    secondaryTopBannerImageUrl: {
      type: GraphQLString,
      resolve: _ => _.get('secondaryTopBannerImageUrl'),
    },
  },
});
