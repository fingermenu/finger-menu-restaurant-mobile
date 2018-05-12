// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { Map } from 'immutable';

const schema = {
  name: 'Phone',
  properties: {
    label: 'string',
    number: 'string',
  },
};

export default class Phone {
  static getSchema = () => schema;

  constructor({ label, number }) {
    this.object = ImmutableEx.removeUndefinedProps(Map({ label, number }));
  }

  getInfo = () => this.object;
}
