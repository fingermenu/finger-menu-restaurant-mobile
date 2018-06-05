// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import DatePicker from 'react-native-datepicker';

const DailyReportView = ({ from, to }) => (
  <View style={{ flex: 1, flexDirection: 'row' }}>
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
      <DatePicker mode="date" placeholder="From" date={from} confirmBtnText="Confirm" cancelBtnText="Cancel" format="DD-MM-YYYY" />
    </View>
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
      <DatePicker mode="date" placeholder="To" date={to} confirmBtnText="Confirm" cancelBtnText="Cancel" format="DD-MM-YYYY" />
    </View>
  </View>
);

DailyReportView.propTypes = {
  from: PropTypes.instanceOf(Date).isRequired,
  to: PropTypes.instanceOf(Date).isRequired,
};

export default DailyReportView;
