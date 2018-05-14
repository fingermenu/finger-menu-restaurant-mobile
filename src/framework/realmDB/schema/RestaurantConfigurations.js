// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { Map } from 'immutable';

const schema = {
  name: 'RestaurantConfigurations',
  properties: {
    images: 'RestaurantImages?',
    languages: 'RestaurantLanguages?',
    printers: 'Printer[]',
    documentTemplates: 'DocumentTemplate[]',
    numberOfPrintCopiesForKitchen: 'int?',
    gstPercentage: 'int?',
  },
};

export default class RestaurantConfigurations {
  static getSchema = () => schema;

  constructor({ name, template }) {
    this.object = ImmutableEx.removeUndefinedProps(Map({ name, template }));
  }

  getInfo = () => this.object;
}
