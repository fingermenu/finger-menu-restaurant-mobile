// @flow

import { Map } from 'immutable';
import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql';
import { realm, RestaurantService, TableService } from '../../realmDB';
import GeoLocation from './GeoLocation';
import Phone from './Phone';
import Menu from './Menu';
import Table from './Table';
import RestaurantConfigurations from './RestaurantConfigurations';
import { NodeInterface } from '../interface';
import Common from './Common';

const getTableCriteria = restaurantId =>
  Map({
    conditions: Map({
      restaurantId,
    }),
  });

const getTablesMatchCriteria = async restaurantId => new TableService(realm).search(getTableCriteria(restaurantId).set('limit', 1000));

export const getRestaurant = async restaurantId => new RestaurantService(realm).read(restaurantId);

const ParentRestaurant = new GraphQLObjectType({
  name: 'ParentRestaurant',
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
    websiteUrl: {
      type: GraphQLString,
      resolve: async _ => _.get('websiteUrl'),
    },
    address: {
      type: GraphQLString,
      resolve: _ => _.get('address'),
    },
    geoLocation: {
      type: GeoLocation,
      resolve: _ => {
        const geoLocation = _.get('geoLocation');

        if (!geoLocation) {
          return null;
        }

        return Map({ latitude: geoLocation.latitude, longitude: geoLocation.longitude });
      },
    },
    phones: {
      type: new GraphQLList(new GraphQLNonNull(Phone)),
      resolve: _ => {
        const phones = _.get('phones');

        if (!phones) {
          return [];
        }

        return phones.toArray();
      },
    },
    googleMapUrl: {
      type: GraphQLString,
      resolve: _ => _.get('googleMapUrl'),
    },
    inheritParentRestaurantMenus: {
      type: GraphQLBoolean,
      resolve: _ => _.get('inheritParentRestaurantMenus'),
    },
    pin: {
      type: GraphQLString,
      resolve: async _ => _.get('pin'),
    },
    menus: {
      type: new GraphQLList(new GraphQLNonNull(Menu)),
      resolve: async (_, args, { dataLoaders: { menuLoaderById, restaurantLoaderById } }) => {
        const menuIds = _.get('menuIds');

        if (!menuIds || menuIds.isEmpty()) {
          return [];
        }

        const menus = await menuLoaderById.loadMany(menuIds.toArray());
        const menuSortOrderIndices = (await restaurantLoaderById.load(_.get('id'))).get('menuSortOrderIndices');

        return menus.map(_ => _.set('sortOrderIndex', menuSortOrderIndices.get(_.get('id'))));
      },
    },
    tables: {
      type: new GraphQLList(new GraphQLNonNull(Table)),
      resolve: async _ => (await getTablesMatchCriteria(_.get('id'))).toArray(),
    },
    configurations: {
      type: new GraphQLNonNull(RestaurantConfigurations),
      resolve: _ => (_.get('configurations') ? _.get('configurations') : Map()),
    },
  },
  interfaces: [NodeInterface],
});

export default new GraphQLObjectType({
  name: 'Restaurant',
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
    websiteUrl: {
      type: GraphQLString,
      resolve: async _ => _.get('websiteUrl'),
    },
    address: {
      type: GraphQLString,
      resolve: _ => _.get('address'),
    },
    geoLocation: {
      type: GeoLocation,
      resolve: _ => {
        const geoLocation = _.get('geoLocation');

        if (!geoLocation) {
          return null;
        }

        return Map({ latitude: geoLocation.latitude, longitude: geoLocation.longitude });
      },
    },
    phones: {
      type: new GraphQLList(new GraphQLNonNull(Phone)),
      resolve: _ => {
        const phones = _.get('phones');

        if (!phones) {
          return [];
        }

        return phones.toArray();
      },
    },
    googleMapUrl: {
      type: GraphQLString,
      resolve: _ => _.get('googleMapUrl'),
    },
    inheritParentRestaurantMenus: {
      type: GraphQLBoolean,
      resolve: _ => _.get('inheritParentRestaurantMenus'),
    },
    pin: {
      type: GraphQLString,
      resolve: async _ => _.get('pin'),
    },
    menus: {
      type: new GraphQLList(new GraphQLNonNull(Menu)),
      resolve: async (_, args, { dataLoaders: { menuLoaderById, restaurantLoaderById } }) => {
        const menuIds = _.get('menuIds');

        if (!menuIds || menuIds.isEmpty()) {
          return [];
        }

        const menus = await menuLoaderById.loadMany(menuIds.toArray());
        const menuSortOrderIndices = (await restaurantLoaderById.load(_.get('id'))).get('menuSortOrderIndices');

        return menus.map(_ => _.set('sortOrderIndex', menuSortOrderIndices.get(_.get('id'))));
      },
    },
    tables: {
      type: new GraphQLList(new GraphQLNonNull(Table)),
      resolve: async _ => (await getTablesMatchCriteria(_.get('id'))).toArray(),
    },
    configurations: {
      type: new GraphQLNonNull(RestaurantConfigurations),
      resolve: _ => (_.get('configurations') ? _.get('configurations') : Map()),
    },
    parentRestaurant: {
      type: ParentRestaurant,
      resolve: async (_, args, { dataLoaders: { restaurantLoaderById } }) =>
        _.get('parentRestaurantId') ? restaurantLoaderById.load(_.get('parentRestaurantId')) : null,
    },
  },
  interfaces: [NodeInterface],
});
