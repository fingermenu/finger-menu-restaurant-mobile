// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { Map } from 'immutable';

const schema = {
  name: 'DocumentTemplate',
  properties: {
    name: 'string?',
    template: 'string',
  },
};

export default class DocumentTemplate {
  static getSchema = () => schema;

  constructor({ name, template }) {
    this.object = ImmutableEx.removeUndefinedProps(Map({ name, template }));
  }

  getInfo = () => this.object;
}
