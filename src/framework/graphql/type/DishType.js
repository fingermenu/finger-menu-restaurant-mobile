// @flow

import { GraphQLID, GraphQLObjectType, GraphQLNonNull } from 'graphql';
import { realm, DishTypeService } from '../../realmDB';
import { NodeInterface } from '../interface';
import Tag from './Tag';

export const getDishType = async dishTypeId => new DishTypeService(realm).read(dishTypeId);

export default new GraphQLObjectType({
  name: 'DishType',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: _ => _.get('id'),
    },
    tag: {
      type: Tag,
      resolve: async (_, args, { dataLoaders: { tagLoaderById } }) => (_.get('tagId') ? tagLoaderById.load(_.get('tagId')) : null),
    },
  },
  interfaces: [NodeInterface],
});
