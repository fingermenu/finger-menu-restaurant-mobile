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
      resolve: async (_, args, { language, dataLoaders: { configLoaderByKey } }) => Common.getTranslation(_, 'name', language, configLoaderByKey),
    },
    nameToPrint: {
      type: GraphQLString,
      resolve: async (_, args, { dataLoaders: { configLoaderByKey } }) => Common.getTranslationToPrint(_, 'name', configLoaderByKey),
    },
    imageUrl: {
      type: GraphQLString,
      resolve: async _ => _.get('imageUrl'),
    },
  },
  interfaces: [NodeInterface],
});
