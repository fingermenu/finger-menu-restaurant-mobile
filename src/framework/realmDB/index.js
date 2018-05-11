// @flow

import Realm from 'realm';
import {
  ChoiceItem,
  ChoiceItemPrice,
  DietaryOption,
  DishType,
  Language,
  MenuItem,
  MenuItemPrice,
  MultiLanguagesString,
  ServingTime,
  Size,
  Tag,
} from './schema';

export {
  ChoiceItemService,
  ChoiceItemPriceService,
  DietaryOptionService,
  DishTypeService,
  LanguageService,
  MenuItemService,
  MenuItemPriceService,
  ServingTimeService,
  SizeService,
  TagService,
} from './services';

export const realm = new Realm({
  schema: [
    MultiLanguagesString.getSchema(),
    ChoiceItem.getSchema(),
    ChoiceItemPrice.getSchema(),
    DietaryOption.getSchema(),
    DishType.getSchema(),
    Language.getSchema(),
    MenuItem.getSchema(),
    MenuItemPrice.getSchema(),
    ServingTime.getSchema(),
    Size.getSchema(),
    Tag.getSchema(),
  ],
  deleteRealmIfMigrationNeeded: true,
});
