// @flow

import { GraphQLID, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { realm, TableStateService } from '../../realmDB';
import { NodeInterface } from '../interface';
import Common from './Common';

export const getTableState = async tableStateId => new TableStateService(realm).read(tableStateId);

export default new GraphQLObjectType({
  name: 'TableState',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: _ => _.get('id'),
    },
    key: {
      type: GraphQLString,
      resolve: _ => _.get('key'),
    },
    name: {
      type: GraphQLString,
      resolve: async (_, args, { language, dataLoaders, fingerMenuContext }) =>
        Common.getTranslationToDisplay(_, 'name', language, dataLoaders, fingerMenuContext),
    },
    nameToPrintOnKitchenReceipt: {
      type: GraphQLString,
      resolve: async (_, args, { dataLoaders, fingerMenuContext }) =>
        Common.getTranslationToPrintOnKitchenReceipt(_, 'name', dataLoaders, fingerMenuContext),
    },
    nameToPrintOnCustomerReceipt: {
      type: GraphQLString,
      resolve: async (_, args, { dataLoaders, fingerMenuContext }) =>
        Common.getTranslationToPrintOnCustomerReceipt(_, 'name', dataLoaders, fingerMenuContext),
    },
    imageUrl: {
      type: GraphQLString,
      resolve: async _ => _.get('imageUrl'),
    },
  },
  interfaces: [NodeInterface],
});
