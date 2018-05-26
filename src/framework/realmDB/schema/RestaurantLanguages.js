// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { Map } from 'immutable';

const schema = {
  name: 'RestaurantLanguages',
  properties: {
    defaultDisplay: 'string?',
    printOnCustomerReceipt: 'string?',
    printOnKitchenReceipt: 'string?',
  },
};

export default class RestaurantImages {
  static getSchema = () => schema;

  constructor({ defaultDisplay, printOnCustomerReceipt, printOnKitchenReceipt }) {
    this.object = ImmutableEx.removeUndefinedProps(
      Map({
        defaultDisplay,
        printOnCustomerReceipt,
        printOnKitchenReceipt,
      }),
    );
  }

  getInfo = () => this.object;
}
