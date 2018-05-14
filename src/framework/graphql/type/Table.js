// @flow

import { GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { realm, TableService } from '../../realmDB';
import { NodeInterface } from '../interface';
import Common from './Common';

export const getTable = async tableId => new TableService(realm).read(tableId);

export default new GraphQLObjectType({
  name: 'Table',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: _ => _.get('id'),
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
    sortOrderIndex: {
      type: GraphQLInt,
      resolve: _ => _.get('sortOrderIndex'),
    },
  },
  interfaces: [NodeInterface],
});
