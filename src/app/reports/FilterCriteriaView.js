// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { convert, ZonedDateTime } from 'js-joda';
import { translate } from 'react-i18next';
import Styles from './Styles';

const FilterCriteriaView = ({ t, dateFormat, from, to, onFromDateChanged, onToDateChanged }) => (
  <View style={Styles.dateRangeContainer}>
    <DatePicker
      mode="date"
      placeholder="From"
      date={convert(from).toDate()}
      confirmBtnText={t('confirm.button')}
      cancelBtnText={t('cancel.button')}
      format={dateFormat}
      onDateChange={onFromDateChanged}
    />
    <DatePicker
      mode="date"
      placeholder="To"
      date={convert(to).toDate()}
      minDate={convert(from).toDate()}
      maxDate={convert(from.plusMonths(1)).toDate()}
      confirmBtnText={t('confirm.button')}
      cancelBtnText={t('cancel.button')}
      format={dateFormat}
      onDateChange={onToDateChanged}
    />
  </View>
);

FilterCriteriaView.propTypes = {
  dateFormat: PropTypes.string.isRequired,
  from: PropTypes.instanceOf(ZonedDateTime).isRequired,
  to: PropTypes.instanceOf(ZonedDateTime).isRequired,
  onFromDateChanged: PropTypes.func.isRequired,
  onToDateChanged: PropTypes.func.isRequired,
};

export default translate()(FilterCriteriaView);
