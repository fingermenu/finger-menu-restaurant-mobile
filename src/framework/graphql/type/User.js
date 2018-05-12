// @flow

import Immutable from 'immutable';
import { GraphQLBoolean, GraphQLID, GraphQLInt, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLList } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import { NodeInterface } from '../interface';
import Tag from './Tag';
import TagConnection, { getTags } from './TagConnection';
import ChoiceItem from './ChoiceItem';
import ChoiceItemConnection, { getChoiceItems } from './ChoiceItemConnection';
import ChoiceItemPrice from './ChoiceItemPrice';
import ChoiceItemPriceConnection, { getChoiceItemPrices } from './ChoiceItemPriceConnection';
import MenuItem from './MenuItem';
import MenuItemConnection, { getMenuItems } from './MenuItemConnection';
import MenuItemPrice from './MenuItemPrice';
import MenuItemPriceConnection, { getMenuItemPrices } from './MenuItemPriceConnection';
import Menu from './Menu';
import MenuConnection, { getMenus } from './MenuConnection';

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
    choiceItemPrice: {
      type: ChoiceItemPrice,
      args: {
        choiceItemPriceId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { choiceItemPriceId }, { dataLoaders: { choiceItemPriceLoaderById } }) =>
        choiceItemPriceId ? choiceItemPriceLoaderById.load(choiceItemPriceId) : null,
    },
    choiceItemPrices: {
      type: ChoiceItemPriceConnection.connectionType,
      args: {
        ...connectionArgs,
        choiceItemPriceIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
        menuItemPriceId: { type: GraphQLID },
        sortOption: { type: GraphQLString },
      },
      resolve: async (_, args, { dataLoaders }) => getChoiceItemPrices(Immutable.fromJS(args), dataLoaders),
    },
    menuItem: {
      type: MenuItem,
      args: {
        menuItemId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { menuItemId }, { dataLoaders: { menuItemLoaderById } }) => (menuItemId ? menuItemLoaderById.load(menuItemId) : null),
    },
    menuItems: {
      type: MenuItemConnection.connectionType,
      args: {
        ...connectionArgs,
        menuItemIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        sortOption: { type: GraphQLString },
      },
      resolve: async (_, args, { language }) => getMenuItems(Immutable.fromJS(args), language),
    },
    menuItemPrice: {
      type: MenuItemPrice,
      args: {
        menuItemPriceId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { menuItemPriceId }, { dataLoaders: { menuItemPriceLoaderById } }) =>
        menuItemPriceId ? menuItemPriceLoaderById.load(menuItemPriceId) : null,
    },
    menuItemPrices: {
      type: MenuItemPriceConnection.connectionType,
      args: {
        ...connectionArgs,
        menuItemPriceIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
        menuId: { type: GraphQLID },
        sortOption: { type: GraphQLString },
      },
      resolve: async (_, args, { dataLoaders }) => getMenuItemPrices(Immutable.fromJS(args), dataLoaders),
    },
    menu: {
      type: Menu,
      args: {
        menuId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { menuId }, { dataLoaders: { menuLoaderById } }) => (menuId ? menuLoaderById.load(menuId) : null),
    },
    menus: {
      type: MenuConnection.connectionType,
      args: {
        ...connectionArgs,
        menuIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
        restaurantId: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        sortOption: { type: GraphQLString },
      },
      resolve: async (_, args, { dataLoaders, language }) => getMenus(Immutable.fromJS(args), dataLoaders, language),
    },
  },
  interfaces: [NodeInterface],
});
