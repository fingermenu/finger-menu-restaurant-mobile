// @flow

import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { translate } from 'react-i18next';
import Styles from './Styles';
import { DefaultStyles } from '../../style';

const PrintReceiptPopupDialogContentView = ({ t, onPrintButtonPressed, onCancelButtonPressed }) => (
  <View style={Styles.popupDialogContainer}>
    <Text style={[DefaultStyles.primaryLabelFont, Styles.popupDialogConfirmText]}>
      {t('areYouSureToPrintReceipt.message')}
    </Text>
    <View style={Styles.popupDialogButtonsContainer}>
      <Button title={t('printReceipt.button')} containerStyle={Styles.buttonContainer} buttonStyle={Styles.button} onPress={onPrintButtonPressed} />
      <Button title={t('cancel.button')} containerStyle={Styles.buttonContainer} buttonStyle={Styles.button} onPress={onCancelButtonPressed} />
    </View>
  </View>
);

PrintReceiptPopupDialogContentView.propTypes = {
  onPrintButtonPressed: PropTypes.func.isRequired,
  onCancelButtonPressed: PropTypes.func.isRequired,
};

export default translate()(PrintReceiptPopupDialogContentView);
