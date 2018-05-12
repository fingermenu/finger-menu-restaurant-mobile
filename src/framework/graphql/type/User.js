// @flow

import Immutable from 'immutable';
import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import { NodeInterface } from '../interface';
import Tag from './Tag';
import TagConnection, { getTags } from './TagConnection';
import ChoiceItem from './ChoiceItem';
import ChoiceItemConnection, { getChoiceItems } from './ChoiceItemConnection';

export default new GraphQLObjectType({
  name: 'User',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: _ => _.get('id'),
    },
    tag: {
      type: Tag,
      args: {
        tagId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { tagId }, { dataLoaders: { tagLoaderById } }) => (tagId ? tagLoaderById.load(tagId) : null),
    },
    tags: {
      type: TagConnection.connectionType,
      args: {
        ...connectionArgs,
        tagIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        level: { type: GraphQLInt },
        forDisplay: { type: GraphQLBoolean },
        sortOption: { type: GraphQLString },
      },
      resolve: async (_, args, { language }) => getTags(Immutable.fromJS(args), language),
    },
    choiceItem: {
      type: ChoiceItem,
      args: {
        choiceItemId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { choiceItemId }, { dataLoaders: { choiceItemLoaderById } }) =>
        choiceItemId ? choiceItemLoaderById.load(choiceItemId) : null,
    },
    choiceItems: {
      type: ChoiceItemConnection.connectionType,
      args: {
        ...connectionArgs,
        choiceItemIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        sortOption: { type: GraphQLString },
      },
      resolve: async (_, args, { language }) => getChoiceItems(Immutable.fromJS(args), language),
    },
  },
  interfaces: [NodeInterface],
});
