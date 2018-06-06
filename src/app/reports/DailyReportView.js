// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { convert, ZonedDateTime } from 'js-joda';
import Styles from './Styles';

const DailyReportView = ({ dateFormat, from, to, onFromDateChanged, onToDateChanged }) => (
  <View style={Styles.dateRangeContainer}>
    <DatePicker
      mode="date"
      placeholder="From"
      date={convert(from).toDate()}
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      format={dateFormat}
      onDateChange={onFromDateChanged}
    />
    <DatePicker
      mode="date"
      placeholder="To"
      date={convert(to).toDate()}
      minDate={convert(from).toDate()}
      maxDate={convert(from.plusMonths(1)).toDate()}
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      format={dateFormat}
      onDateChange={onToDateChanged}
    />
  </View>
);

DailyReportView.propTypes = {
  dateFormat: PropTypes.string.isRequired,
  from: PropTypes.instanceOf(ZonedDateTime).isRequired,
  to: PropTypes.instanceOf(ZonedDateTime).isRequired,
  onFromDateChanged: PropTypes.func.isRequired,
  onToDateChanged: PropTypes.func.isRequired,
};

export default DailyReportView;
