// @flow

import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { translate } from 'react-i18next';
import Styles from './Styles';
import { DefaultColor, DefaultStyles } from '../../style';

const DefaultPaymentButtonsView = ({
  t,
  fullPaymentDisabled,
  onFullPaymentButtonPressed,
  splitPaymentDisabled,
  onSplitPaymentButtonPressed,
  onResetButtonPressed,
  giveToGuestDisabled,
  onGiveToGuestButtonPressed,
  canPrintReceipt,
  printReceiptDisabled,
  onPrintReceiptButtonPressed,
  canPrintKitchenOrder,
  rePrintKitchenDisabled,
  onRePrintKitchenButtonPressed,
}) => (
  <View>
    <View style={Styles.mainScreenButtonsContainer}>
      <Button
        title={t('fullPayment.button')}
        titleStyle={DefaultStyles.primaryButtonTitle}
        disabled={fullPaymentDisabled}
        onPress={onFullPaymentButtonPressed}
      />
      <Button
        title={t('splitPayment.button')}
        titleStyle={DefaultStyles.primaryButtonTitle}
        disabled={splitPaymentDisabled}
        onPress={onSplitPaymentButtonPressed}
      />
      <Button
        title={t('resetTable.button')}
        titleStyle={DefaultStyles.primaryButtonTitle}
        backgroundColor={DefaultColor.defaultButtonColor}
        onPress={onResetButtonPressed}
      />
      <Button
        title={t('giveToGuest.button')}
        titleStyle={DefaultStyles.primaryButtonTitle}
        disabled={giveToGuestDisabled}
        onPress={onGiveToGuestButtonPressed}
      />
    </View>
    <View style={Styles.mainScreenButtonsContainer}>
      {canPrintReceipt && (
        <Button
          title={t('printReceipt.button')}
          titleStyle={DefaultStyles.primaryButtonTitle}
          disabled={printReceiptDisabled}
          onPress={onPrintReceiptButtonPressed}
        />
      )}
      {canPrintKitchenOrder && (
        <Button
          title={t('rePrintForKitchen.button')}
          titleStyle={DefaultStyles.primaryButtonTitle}
          disabled={rePrintKitchenDisabled}
          onPress={onRePrintKitchenButtonPressed}
        />
      )}
    </View>
  </View>
);

DefaultPaymentButtonsView.propTypes = {
  fullPaymentDisabled: PropTypes.bool.isRequired,
  onFullPaymentButtonPressed: PropTypes.func.isRequired,
  splitPaymentDisabled: PropTypes.bool.isRequired,
  onSplitPaymentButtonPressed: PropTypes.func.isRequired,
  onResetButtonPressed: PropTypes.func.isRequired,
  giveToGuestDisabled: PropTypes.bool.isRequired,
  onGiveToGuestButtonPressed: PropTypes.func.isRequired,
  canPrintReceipt: PropTypes.bool.isRequired,
  printReceiptDisabled: PropTypes.bool.isRequired,
  onPrintReceiptButtonPressed: PropTypes.func.isRequired,
  canPrintKitchenOrder: PropTypes.bool.isRequired,
  rePrintKitchenDisabled: PropTypes.bool.isRequired,
  onRePrintKitchenButtonPressed: PropTypes.func.isRequired,
};

export default translate()(DefaultPaymentButtonsView);
