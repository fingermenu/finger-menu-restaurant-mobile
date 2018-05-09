// @flow

export default class Query {
  constructor() {
    this.queryStr = '';
  }

  addAndQuery = newQueryStr => {
    this.queryStr = this.queryStr + (this.isQueryEmpty() ? `(${newQueryStr})` : ` AND (${newQueryStr})`);

    return this;
  };

  addOrQuery = newQueryStr => {
    this.queryStr = this.queryStr + (this.isQueryEmpty() ? `(${newQueryStr})` : ` OR (${newQueryStr})`);

    return this;
  };

  getQueryStr = () => this.queryStr;

  isQueryEmpty = () => !this.getQueryStr() || this.getQueryStr().trim().length === 0;
}
