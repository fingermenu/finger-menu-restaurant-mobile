// @flow

import { Map } from 'immutable';
import { ChronoUnit, ZonedDateTime } from 'js-joda';

export default Map({
  from: ZonedDateTime.now().truncatedTo(ChronoUnit.DAYS),
  to: ZonedDateTime.now().truncatedTo(ChronoUnit.DAYS),
});
