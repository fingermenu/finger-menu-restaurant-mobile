// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import Immutable, { Map } from 'immutable';

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

  constructor({ images, languages, printers, documentTemplates, numberOfPrintCopiesForKitchen, gstPercentage }) {
    this.object = ImmutableEx.removeUndefinedProps(
      Map({
        images,
        languages: Immutable.fromJS(languages),
        printers: Immutable.fromJS(printers),
        documentTemplates: Immutable.fromJS(documentTemplates),
        numberOfPrintCopiesForKitchen,
        gstPercentage,
      }),
    );
  }

  getInfo = () => this.object;
}
