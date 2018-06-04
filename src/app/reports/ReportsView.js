// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Button } from 'react-native-elements';
import { translate } from 'react-i18next';
import Styles from './Styles';

const ReportsView = ({ t, onDailyReportClicked }) => (
  <View style={Styles.dailyReportContainer}>
    <Button title={t('dailyReport.button')} onPress={onDailyReportClicked} />
  </View>
);

ReportsView.propTypes = {
  onDailyReportClicked: PropTypes.func.isRequired,
};

export default translate()(ReportsView);
