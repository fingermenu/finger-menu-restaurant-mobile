// @flow

import { List, Map } from 'immutable';
import Dataloader from 'dataloader';
import { realm, RestaurantService } from '../../realmDB';

const restaurantLoaderById = new Dataloader(async ids => {
  const restaurants = await new RestaurantService(realm).search(Map({ ids: List(ids), limit: 1000, skip: 0 }));

  return ids.map(id => restaurants.find(restaurant => restaurant.get('id').localeCompare(id) === 0));
});

export default restaurantLoaderById;
