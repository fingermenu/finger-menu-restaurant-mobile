// @flow

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import { translate } from 'react-i18next';
import Styles from './Styles';
import { DefaultStyles } from '../../style';
import EftposAndCashSplitView from './EftposAndCashSplitView';

class SplitPaymentPopupDialogContentView extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      eftpos: props.balanceToPay,
      cash: 0.0,
    };
  }

  handleEftposAndCashValuesChanged = ({ eftpos, cash }) => {
    this.setState({ eftpos, cash });
  };
  handlePaidButtonPressed = () => {
    const { eftpos, cash } = this.state;
    const { onPaidButtonPressed } = this.props;

    onPaidButtonPressed({ eftpos, cash });
  };

  handlePaidAndPrintButtonPressed = () => {
    const { eftpos, cash } = this.state;
    const { onPaidAndPrintButtonPressed } = this.props;

    onPaidAndPrintButtonPressed({ eftpos, cash });
  };

  render = () => {
    const { t, total, discount, balanceToPay, onCancelButtonPressed } = this.props;

    return (
      <View style={Styles.popupDialogContainer}>
        <View>
          <View style={Styles.paymentSummaryTotalRow}>
            <Text style={DefaultStyles.primaryLabelFont}>{t('total.label').replace('{total}', total.toFixed(2))}</Text>
            <Text style={DefaultStyles.primaryLabelFont}>{t('discount.label').replace('{discount}', discount)}</Text>
          </View>
          <View style={Styles.paymentSummaryBalanceRow}>
            <Text style={DefaultStyles.primaryTitleFont}>{t('balanceToPay.label').replace('{balanceToPay}', balanceToPay.toFixed(2))}</Text>
          </View>
          <EftposAndCashSplitView balanceToPay={balanceToPay} onValuesChanged={this.handleEftposAndCashValuesChanged} />
          <Text style={[DefaultStyles.primaryLabelFont, Styles.popupDialogConfirmText]}> 
            {' '}
            {t('confirmPayment.message')}
          </Text>
          <View style={Styles.popupDialogButtonsContainer}>
            <Button
              title={t('confirm.button')}
              containerStyle={Styles.buttonContainer}
              buttonStyle={Styles.button}
              onPress={this.handlePaidButtonPressed}
            />
            <Button
              title={t('confirmAndPrintReceipt.button')}
              containerStyle={Styles.buttonContainer}
              buttonStyle={Styles.button}
              onPress={this.handlePaidAndPrintButtonPressed}
            />
            <Button title={t('cancel.button')} containerStyle={Styles.buttonContainer} buttonStyle={Styles.button} onPress={onCancelButtonPressed} />
          </View>
        </View>
      </View>
    );
  };
}

SplitPaymentPopupDialogContentView.propTypes = {
  total: PropTypes.number.isRequired,
  discount: PropTypes.string.isRequired,
  balanceToPay: PropTypes.number.isRequired,
  onPaidButtonPressed: PropTypes.func.isRequired,
  onPaidAndPrintButtonPressed: PropTypes.func.isRequired,
  onCancelButtonPressed: PropTypes.func.isRequired,
};

export default translate()(SplitPaymentPopupDialogContentView);
