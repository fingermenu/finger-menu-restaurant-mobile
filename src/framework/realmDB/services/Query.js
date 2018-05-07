// @flow

export default class Query {
  constructor() {
    this.queryStr = '';
  }

  addAndQuery = query => {
    this.queryStr = this.queryStr + (!query || !query.trim().length === 0 ? query : `$ AND ${query}`);

    return this;
  };

  addOrQuery = query => {
    this.queryStr = this.queryStr + (!query || !query.trim().length === 0 ? query : `$ OR ${query}`);

    return this;
  };

  getQuery = () => this.queryStr;
}
