// @flow

import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLNonNull } from 'graphql';
import RestaurantImages from './RestaurantImages';
import Printer from './Printer';
import DocumentTemplate from './DocumentTemplate';

export default new GraphQLObjectType({
  name: 'RestaurantConfigurations',
  fields: {
    images: {
      type: RestaurantImages,
      resolve: _ => (_.get('images') ? _.get('images') : null),
    },
    printers: {
      type: new GraphQLList(new GraphQLNonNull(Printer)),
      resolve: _ => (_.get('printers') ? _.get('printers').toArray() : []),
    },
    documentTemplates: {
      type: new GraphQLList(new GraphQLNonNull(DocumentTemplate)),
      resolve: _ => (_.get('documentTemplates') ? _.get('documentTemplates').toArray() : []),
    },
    numberOfPrintCopiesForKitchen: {
      type: GraphQLInt,
      resolve: _ => (_.get('numberOfPrintCopiesForKitchen') ? _.get('numberOfPrintCopiesForKitchen') : 1),
    },
    gstPercentage: {
      type: GraphQLFloat,
      resolve: _ => _.get('gstPercentage'),
    },
  },
});
