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
      resolve: async (_, args, { language, dataLoaders: { configLoaderByKey } }) => Common.getTranslation(_, 'name', language, configLoaderByKey),
    },
    nameToPrint: {
      type: GraphQLString,
      resolve: async (_, args, { dataLoaders: { configLoaderByKey } }) => Common.getTranslationToPrint(_, 'name', configLoaderByKey),
    },
    sortOrderIndex: {
      type: GraphQLInt,
      resolve: _ => _.get('sortOrderIndex'),
    },
  },
  interfaces: [NodeInterface],
});
