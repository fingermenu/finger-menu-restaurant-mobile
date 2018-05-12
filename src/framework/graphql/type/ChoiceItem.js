// @flow

import { GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { realm, ChoiceItemService } from '../../realmDB';
import { NodeInterface } from '../interface';
import Tag from './Tag';
import Common from './Common';

export const getChoiceItem = async choiceItemId => new ChoiceItemService(realm).read(choiceItemId);

export default new GraphQLObjectType({
  name: 'ChoiceItem',
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
    description: {
      type: GraphQLString,
      resolve: async (_, args, { language, dataLoaders: { configLoaderByKey } }) =>
        Common.getTranslation(_, 'description', language, configLoaderByKey),
    },
    descriptionToPrint: {
      type: GraphQLString,
      resolve: async (_, args, { dataLoaders: { configLoaderByKey } }) => Common.getTranslationToPrint(_, 'description', configLoaderByKey),
    },
    choiceItemPageUrl: {
      type: GraphQLString,
      resolve: async _ => _.get('choiceItemPageUrl'),
    },
    imageUrl: {
      type: GraphQLString,
      resolve: async _ => _.get('imageUrl'),
    },
    tags: {
      type: new GraphQLList(new GraphQLNonNull(Tag)),
      resolve: async (_, args, { dataLoaders: { tagLoaderById } }) => tagLoaderById.loadMany(_.get('tagIds').toArray()),
    },
  },
  interfaces: [NodeInterface],
});
