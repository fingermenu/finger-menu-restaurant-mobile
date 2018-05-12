// @flow

import Realm from 'realm';
import {
  ChoiceItem,
  ChoiceItemPrice,
  DietaryOption,
  DishType,
  Language,
  Menu,
  MenuItem,
  MenuItemPrice,
  MultiLanguagesString,
  Rules,
  ServingTime,
  SortOrderIndex,
  Size,
  Table,
  Tag,
} from './schema';

export {
  ChoiceItemService,
  ChoiceItemPriceService,
  DietaryOptionService,
  DishTypeService,
  LanguageService,
  MenuService,
  MenuItemService,
  MenuItemPriceService,
  ServingTimeService,
  SizeService,
  TableService,
  TagService,
} from './services';

export const realm = new Realm({
  schema: [
    ChoiceItem.getSchema(),
    ChoiceItemPrice.getSchema(),
    DietaryOption.getSchema(),
    DishType.getSchema(),
    Language.getSchema(),
    Menu.getSchema(),
    MenuItem.getSchema(),
    MenuItemPrice.getSchema(),
    MultiLanguagesString.getSchema(),
    Rules.getSchema(),
    ServingTime.getSchema(),
    SortOrderIndex.getSchema(),
    Size.getSchema(),
    Table.getSchema(),
    Tag.getSchema(),
  ],
  deleteRealmIfMigrationNeeded: true,
});
