// @flow

import { GraphQLID, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { realm, MenuService } from '../../realmDB';
import { NodeInterface } from '../interface';
import MenuItemPrice from './MenuItemPrice';
import Tag from './Tag';
import Common from './Common';

export const getMenu = async menuId => new MenuService(realm).read(menuId);

export default new GraphQLObjectType({
  name: 'Menu',
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
    menuPageUrl: {
      type: GraphQLString,
      resolve: async _ => _.get('menuPageUrl'),
    },
    imageUrl: {
      type: GraphQLString,
      resolve: async _ => _.get('imageUrl'),
    },
    sortOrderIndex: {
      type: GraphQLInt,
      resolve: _ => _.get('sortOrderIndex'),
    },
    menuItemPrices: {
      type: new GraphQLList(new GraphQLNonNull(MenuItemPrice)),
      resolve: async (_, args, { dataLoaders: { menuLoaderById, menuItemPriceLoaderById } }) => {
        const menuItemPriceIds = _.get('menuItemPriceIds');

        if (!menuItemPriceIds || menuItemPriceIds.isEmpty()) {
          return [];
        }

        const menuItemPrices = (await menuItemPriceLoaderById.loadMany(_.get('menuItemPriceIds').toArray())).filter(
          menuItemPrice => !menuItemPrice.has('removedByUser') || !menuItemPrice.get('removedByUser'),
        );

        if (menuItemPrices.length === 0) {
          return [];
        }

        const menuItemPriceSortOrderIndices = (await menuLoaderById.load(_.get('id'))).get('menuItemPriceSortOrderIndices');

        return menuItemPrices.map(_ => _.set('sortOrderIndex', menuItemPriceSortOrderIndices.get(_.get('id'))));
      },
    },
    tags: {
      type: new GraphQLList(new GraphQLNonNull(Tag)),
      resolve: async (_, args, { dataLoaders: { tagLoaderById } }) =>
        _.get('tagIds') && !_.get('tagIds').isEmpty() ? tagLoaderById.loadMany(_.get('tagIds').toArray()) : [],
    },
  },
  interfaces: [NodeInterface],
});
