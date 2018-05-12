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
import Table from './Table';
import TableConnection, { getTables } from './TableConnection';
import Restaurant from './Restaurant';
import RestaurantConnection, { getRestaurants } from './RestaurantConnection';
import ServingTime from './ServingTime';
import ServingTimeConnection, { getServingTimes } from './ServingTimeConnection';
import DietaryOption from './DietaryOption';
import DietaryOptionConnection, { getDietaryOptions } from './DietaryOptionConnection';
import Size from './Size';
import SizeConnection, { getSizes } from './SizeConnection';
import DishType from './DishType';
import DishTypeConnection, { getDishTypes } from './DishTypeConnection';

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
    table: {
      type: Table,
      args: {
        tableId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { tableId }, { dataLoaders: { tableLoaderById } }) => (tableId ? tableLoaderById.load(tableId) : null),
    },
    tables: {
      type: TableConnection.connectionType,
      args: {
        ...connectionArgs,
        tableIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
        restaurantId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        sortOption: { type: GraphQLString },
      },
      resolve: async (_, args, { language }) => getTables(Immutable.fromJS(args), language),
    },
    restaurant: {
      type: Restaurant,
      args: {
        restaurantId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { restaurantId }, { dataLoaders: { restaurantLoaderById } }) =>
        restaurantId ? restaurantLoaderById.load(restaurantId) : null,
    },
    restaurants: {
      type: RestaurantConnection.connectionType,
      args: {
        ...connectionArgs,
        restaurantIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
        name: { type: GraphQLString },
        status: { type: GraphQLBoolean },
        inheritParentRestaurantMenus: { type: GraphQLBoolean },
        sortOption: { type: GraphQLString },
      },
      resolve: async (_, args, { language }) => getRestaurants(Immutable.fromJS(args), language),
    },
    servingTime: {
      type: ServingTime,
      args: {
        servingTimeId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { servingTimeId }, { dataLoaders: { servingTimeLoaderById } }) =>
        servingTimeId ? servingTimeLoaderById.load(servingTimeId) : null,
    },
    servingTimes: {
      type: ServingTimeConnection.connectionType,
      args: {
        ...connectionArgs,
        servingTimeIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
        sortOption: { type: GraphQLString },
      },
      resolve: async (_, args) => getServingTimes(Immutable.fromJS(args)),
    },
    dietaryOption: {
      type: DietaryOption,
      args: {
        dietaryOptionId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { dietaryOptionId }, { dataLoaders: { dietaryOptionLoaderById } }) =>
        dietaryOptionId ? dietaryOptionLoaderById.load(dietaryOptionId) : null,
    },
    dietaryOptions: {
      type: DietaryOptionConnection.connectionType,
      args: {
        ...connectionArgs,
        dietaryOptionIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
        sortOption: { type: GraphQLString },
      },
      resolve: async (_, args) => getDietaryOptions(Immutable.fromJS(args)),
    },
    size: {
      type: Size,
      args: {
        sizeId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { sizeId }, { dataLoaders: { sizeLoaderById } }) => (sizeId ? sizeLoaderById.load(sizeId) : null),
    },
    sizes: {
      type: SizeConnection.connectionType,
      args: {
        ...connectionArgs,
        sizeIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
        sortOption: { type: GraphQLString },
      },
      resolve: async (_, args) => getSizes(Immutable.fromJS(args)),
    },
    dishType: {
      type: DishType,
      args: {
        dishTypeId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_, { dishTypeId }, { dataLoaders: { dishTypeLoaderById } }) => (dishTypeId ? dishTypeLoaderById.load(dishTypeId) : null),
    },
    dishTypes: {
      type: DishTypeConnection.connectionType,
      args: {
        ...connectionArgs,
        dishTypeIds: { type: new GraphQLList(new GraphQLNonNull(GraphQLID)) },
        sortOption: { type: GraphQLString },
      },
      resolve: async (_, args) => getDishTypes(Immutable.fromJS(args)),
    },
  },
  interfaces: [NodeInterface],
});
