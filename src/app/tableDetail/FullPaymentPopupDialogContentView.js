// @flow

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { translate } from 'react-i18next';
import Styles from './Styles';
import { DefaultStyles } from '../../style';
import EftposAndCashSplitView from './EftposAndCashSplitView';

class FullPaymentPopupDialogContentView extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      eftpos: props.balanceToPay,
      cash: 0.0,
    };
  }

  static getDerivedStateFromProps = ({ balanceToPay }, { balanceToPay: currentBalanceToPay }) => {
    if (balanceToPay === currentBalanceToPay) {
      return null;
    }

    return {
      balanceToPay: balanceToPay,
      eftpos: balanceToPay,
      cash: 0.0,
    };
  };

  handleEftposAndCashValuesChanged = ({ eftpos, cash }) => {
    this.setState({ eftpos, cash });
  };

  handlePaidButtonPressed = () => {
    const { eftpos, cash } = this.state;
    const { onPaidButtonPressed } = this.props;

    onPaidButtonPressed({ eftpos, cash });
  };

  handlePaidAndResetButtonPressed = () => {
    const { eftpos, cash } = this.state;
    const { onPaidAndResetButtonPressed } = this.props;

    onPaidAndResetButtonPressed({ eftpos, cash });
  };

  render = () => {
    const { t, tableName, canPrintReceipt, total, discount, balanceToPay, onCancelButtonPressed } = this.props;

    return (
      <View style={Styles.popupDialogContainer}>
        <View style={Styles.paymentSummaryTotalRow}>
          <Text style={DefaultStyles.primaryLabelFont}>{t('total.label').replace('{total}', total.toFixed(2))}</Text>
          <Text style={DefaultStyles.primaryLabelFont}>{t('discount.label').replace('{discount}', discount)}</Text>
        </View>
        <View style={Styles.paymentSummaryBalanceRow}>
          <Text style={DefaultStyles.primaryTitleFont}>{t('balanceToPay.label').replace('{balanceToPay}', balanceToPay.toFixed(2))}</Text>
        </View>
        <EftposAndCashSplitView balanceToPay={balanceToPay} onValuesChanged={this.handleEftposAndCashValuesChanged} />
        <Text style={[DefaultStyles.primaryLabelFont, Styles.popupDialogConfirmText]}>
          {t('areYouSureToPayTableInFull.message').replace('{tableName}', tableName)}
        </Text>
        <View style={Styles.popupDialogButtonsContainer}>
          <Button
            title={t('payNow.button')}
            containerStyle={Styles.buttonContainer}
            buttonStyle={Styles.button}
            onPress={this.handlePaidButtonPressed}
          />
          {canPrintReceipt && (
            <Button
              title={t('payAndResetTableNow.button')}
              containerStyle={Styles.buttonContainer}
              buttonStyle={Styles.button}
              onPress={this.handlePaidAndResetButtonPressed}
            />
          )}
          <Button title={t('cancel.button')} containerStyle={Styles.buttonContainer} buttonStyle={Styles.button} onPress={onCancelButtonPressed} />
        </View>
      </View>
    );
  };
}

FullPaymentPopupDialogContentView.propTypes = {
  tableName: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  discount: PropTypes.string.isRequired,
  balanceToPay: PropTypes.number.isRequired,
  canPrintReceipt: PropTypes.bool.isRequired,
  onPaidButtonPressed: PropTypes.func.isRequired,
  onPaidAndResetButtonPressed: PropTypes.func.isRequired,
  onCancelButtonPressed: PropTypes.func.isRequired,
};

export default translate()(FullPaymentPopupDialogContentView);
