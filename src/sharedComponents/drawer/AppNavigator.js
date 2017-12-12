// @flow

import { StackNavigator } from 'react-navigation';
import { HomeContainer } from '../home';
import { StapleItems } from '../../app/stapleItems';
import { SpecialsFilterContainer } from '../specialsFilter';
import { CategoriesFilter } from '../categoriesFilter';
import { StoresFilter } from '../storesFilter';
import { FlyerContainer } from '../../app/flyer';
import { Products } from '../../app/products';

export default StackNavigator({
  Home: {
    screen: HomeContainer,
  },
  StapleItems: {
    screen: StapleItems,
  },
  SpecialsFilter: {
    screen: SpecialsFilterContainer,
  },
  CategoriesFilter: {
    screen: CategoriesFilter,
  },
  StoresFilter: {
    screen: StoresFilter,
  },
  Flyer: {
    screen: FlyerContainer,
  },
  Products: {
    screen: Products,
  },
});
