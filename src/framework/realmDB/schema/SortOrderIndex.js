// @flow

import { Map } from 'immutable';

const schema = {
  name: 'SortOrderIndex',
  properties: {
    id: 'string',
    index: 'int',
  },
};

export default class MultiLanguagesString {
  static getSchema = () => schema;

  constructor({ id, index }) {
    this.object = Map({ id, index });
  }

  getInfo = () => this.object;
}
