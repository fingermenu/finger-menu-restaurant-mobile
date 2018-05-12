// @flow

import { ImmutableEx } from '@microbusiness/common-javascript';
import { Map } from 'immutable';

const schema = {
  name: 'RestaurantImages',
  properties: {
    logoImageUrl: 'string?',
    primaryLandingPageBackgroundImageUrl: 'string?',
    secondaryLandingPageBackgroundImageUrl: 'string?',
    primaryTopBannerImageUrl: 'string?',
    secondaryTopBannerImageUrl: 'string?',
  },
};

export default class RestaurantImages {
  static getSchema = () => schema;

  constructor({
    logoImageUrl,
    primaryLandingPageBackgroundImageUrl,
    secondaryLandingPageBackgroundImageUrl,
    primaryTopBannerImageUrl,
    secondaryTopBannerImageUrl,
  }) {
    this.object = ImmutableEx.removeUndefinedProps(
      Map({
        logoImageUrl,
        primaryLandingPageBackgroundImageUrl,
        secondaryLandingPageBackgroundImageUrl,
        primaryTopBannerImageUrl,
        secondaryTopBannerImageUrl,
      }),
    );
  }

  getInfo = () => this.object;
}
