// @flow

import { Map } from 'immutable';
import { GraphQLString, GraphQLObjectType } from 'graphql';
import ViewerType from './Viewer';
import UserType from './User';
import { NodeField } from '../interface';

export default new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: UserType,
      args: {
        appVersion: { type: GraphQLString },
      },
      resolve: () => Map({ id: 'UserId' }),
    },
    viewer: {
      type: ViewerType,
      args: {
        appVersion: { type: GraphQLString },
      },
      resolve: () => Map({ id: 'ViewerId' }),
    },
    node: NodeField,
  },
});
