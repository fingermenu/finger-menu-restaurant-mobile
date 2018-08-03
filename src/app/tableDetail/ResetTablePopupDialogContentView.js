// @flow

import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { translate } from 'react-i18next';
import Styles from './Styles';
import { DefaultStyles } from '../../style';

const ResetTablePopupDialogContentView = ({ t, tableName, onResetButtonPressed, onCancelButtonPressed }) => (
  <View style={Styles.popupDialogContainer}>
    <Text style={[DefaultStyles.primaryLabelFont, Styles.popupDialogConfirmText]}>
      {t('areYouSureToResetTable.message').replace('{tableName}', tableName)}
    </Text>
    <View style={Styles.popupDialogButtonsContainer}>
      <Button title={t('resetTable.button')} containerStyle={Styles.buttonContainer} buttonStyle={Styles.button} onPress={onResetButtonPressed} />
      <Button title={t('cancel.button')} containerStyle={Styles.buttonContainer} buttonStyle={Styles.button} onPress={onCancelButtonPressed} />
    </View>
  </View>
);

ResetTablePopupDialogContentView.propTypes = {
  tableName: PropTypes.string.isRequired,
  onResetButtonPressed: PropTypes.func.isRequired,
  onCancelButtonPressed: PropTypes.func.isRequired,
};

export default translate()(ResetTablePopupDialogContentView);
