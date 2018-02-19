// @flow

import { Map } from 'immutable';

const images = Map()
  .set('en_NZ', require('../../../assets/images/en_NZ.png'))
  .set('zh', require('../../../assets/images/zh.png'))
  .set('jp', require('../../../assets/images/jp.png'))
  .set('ko', require('../../../assets/images/ko.png'))
  .set('logo', require('../../../assets/images/logo.png'))
  .set('empty', require('../../../assets/images/empty.png'))
  .set('taken', require('../../../assets/images/taken.png'))
  .set('reserved', require('../../../assets/images/reserved.png'))
  .set('paid', require('../../../assets/images/paid.png'));

export default images;
