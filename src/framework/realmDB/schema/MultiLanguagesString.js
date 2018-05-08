// @flow

import { Map } from 'immutable';

const schema = {
  name: 'MultiLanguagesString',
  properties: {
    language: 'string',
    value: 'string?',
  },
};

export default class MultiLanguagesString {
  static getSchema = () => schema;

  constructor(language, value) {
    this.object = Map({ language, value });
  }

  getObject = () => this.object;
}
