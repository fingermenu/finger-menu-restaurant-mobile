// @flow

import React from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-datepicker';

const DailyReportView = () => (
  <View style={{ flex: 1, flexDirection: 'row' }}>
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
      <DatePicker mode="date" placeholder="From" confirmBtnText="Confirm" cancelBtnText="Cancel" format="DD-MM-YYYY" />
    </View>
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
      <DatePicker mode="date" placeholder="To" confirmBtnText="Confirm" cancelBtnText="Cancel" format="DD-MM-YYYY" />
    </View>
  </View>
);

export default DailyReportView;
