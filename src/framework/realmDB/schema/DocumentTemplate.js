// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { Map } from 'immutable';

const schema = {
  name: 'DocumentTemplate',
  properties: {
    name: 'string?',
    template: 'string',
    maxLineWidthDivisionFactor: 'float',
  },
};

export default class DocumentTemplate {
  static getSchema = () => schema;

  constructor({ name, template, maxLineWidthDivisionFactor }) {
    this.object = ImmutableEx.removeUndefinedProps(Map({ name, template, maxLineWidthDivisionFactor }));
  }

  getInfo = () => this.object;
}
