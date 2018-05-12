// @flow

import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { realm, TagService } from '../../realmDB';
import { NodeInterface } from '../interface';
import Common from './Common';

export const getTag = async tagId => new TagService(realm).read(tagId);

const ParentTag = new GraphQLObjectType({
  name: 'ParentTag',
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
    imageUrl: {
      type: GraphQLString,
      resolve: async _ => _.get('imageUrl'),
    },
    level: {
      type: GraphQLInt,
      resolve: async _ => _.get('level'),
    },
    forDisplay: {
      type: GraphQLBoolean,
      resolve: async _ => _.get('forDisplay'),
    },
  },
  interfaces: [NodeInterface],
});

export default new GraphQLObjectType({
  name: 'Tag',
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
    imageUrl: {
      type: GraphQLString,
      resolve: async _ => _.get('imageUrl'),
    },
    level: {
      type: GraphQLInt,
      resolve: async _ => _.get('level'),
    },
    forDisplay: {
      type: GraphQLBoolean,
      resolve: async _ => _.get('forDisplay'),
    },
    parentTag: {
      type: ParentTag,
      resolve: async (_, args, { dataLoaders: { tagLoaderById } }) => (_.get('parentTagId') ? tagLoaderById.load(_.get('parentTagId')) : null),
    },
  },
  interfaces: [NodeInterface],
});
