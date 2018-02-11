// @flow

import { Map } from 'immutable';

const images = Map()
  .set('en_NZ', require('../../../assets/images/en_NZ.png'))
  .set('zh', require('../../../assets/images/zh.png'))
  .set('jp', require('../../../assets/images/jp.png'))
  .set('ko', require('../../../assets/images/ko.png'));

export default images;
