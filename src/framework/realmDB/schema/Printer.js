// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { Map } from 'immutable';

const schema = {
  name: 'Printer',
  properties: {
    name: 'string?',
    type: 'string?',
    hostname: 'string',
    port: 'int',
    maxLineWidth: 'int',
  },
};

export default class Printer {
  static getSchema = () => schema;

  constructor({ name, type, hostname, port, maxLineWidth }) {
    this.object = ImmutableEx.removeUndefinedProps(Map({ name, type, hostname, port, maxLineWidth }));
  }

  getInfo = () => this.object;
}
