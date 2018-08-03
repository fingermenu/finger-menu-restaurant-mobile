// @flow

import { Common } from '@microbusiness/common-javascript';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Input } from 'react-native-elements';
import { translate } from 'react-i18next';
import { DefaultStyles } from '../../style';

class EftposAndCashSplitView extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      balanceToPay: props.balanceToPay, // eslint-disable-line react/no-unused-state
      eftpos: props.balanceToPay.toFixed(2),
      cash: '0.00',
    };
  }

  static getDerivedStateFromProps = ({ balanceToPay }, { balanceToPay: currentBalanceToPay }) => {
    if (balanceToPay === currentBalanceToPay) {
      return null;
    }

    return {
      balanceToPay: balanceToPay,
      eftpos: balanceToPay.toFixed(2),
      cash: '',
    };
  };

  handleEftposChanged = value => {
    const { balanceToPay } = this.props;
    const valueStr = value ? value.trim() : '';

    if (!valueStr) {
      this.setState({ eftpos: '', cash: balanceToPay.toFixed(2) }, this.handleValuesChanged);
    } else {
      if (!Common.isDecimal(value)) {
        return;
      }

      var eftpos = parseFloat(value);

      if (eftpos > balanceToPay) {
        eftpos = balanceToPay;
      }

      if (eftpos.toString().localeCompare(eftpos.toFixed(0)) === 0) {
        if (valueStr[valueStr.length - 1] === '.') {
          this.setState({ eftpos: valueStr, cash: (balanceToPay - eftpos).toFixed(2) }, this.handleValuesChanged);
        } else {
          this.setState({ eftpos: eftpos ? eftpos.toFixed(0) : '', cash: (balanceToPay - eftpos).toFixed(2) }, this.handleValuesChanged);
        }
      } else {
        this.setState({ eftpos: eftpos ? eftpos.toString() : '', cash: (balanceToPay - eftpos).toFixed(2) }, this.handleValuesChanged);
      }
    }
  };

  handleCashChanged = value => {
    const { balanceToPay } = this.props;
    const valueStr = value ? value.trim() : '';

    if (!valueStr) {
      this.setState({ cash: '', eftpos: balanceToPay.toFixed(2) }, this.handleValuesChanged);
    } else {
      if (!Common.isDecimal(value)) {
        return;
      }

      var cash = parseFloat(value);

      if (cash > balanceToPay) {
        cash = balanceToPay;
      }

      if (cash.toString().localeCompare(cash.toFixed(0)) === 0) {
        if (valueStr[valueStr.length - 1] === '.') {
          this.setState({ cash: valueStr, eftpos: (balanceToPay - cash).toFixed(2) }, this.handleValuesChanged);
        } else {
          this.setState({ cash: cash ? cash.toFixed(0) : '', eftpos: (balanceToPay - cash).toFixed(2) }, this.handleValuesChanged);
        }
      } else {
        this.setState({ cash: cash ? cash.toString() : '', eftpos: (balanceToPay - cash).toFixed(2) }, this.handleValuesChanged);
      }
    }
  };

  handleValuesChanged = () => {
    const { eftpos, cash } = this.state;
    const eftposToBeReported = Common.isDecimal(eftpos) ? parseFloat(eftpos) : 0.0;
    const cashToBeReported = Common.isDecimal(cash) ? parseFloat(cash) : 0.0;
    const { onValuesChanged } = this.props;

    onValuesChanged({ eftpos: eftposToBeReported, cash: cashToBeReported });
  };

  render = () => {
    const { t } = this.props;
    const { eftpos, cash } = this.state;

    return (
      <View style={DefaultStyles.rowContainer}>
        <Text style={DefaultStyles.primaryTitleFont}>
          {t('eftpos.label') + ' $'}
        </Text>
        <Input onChangeText={this.handleEftposChanged} value={eftpos} containerStyle={{ width: 100 }} keyboardType="numeric" />
        <Text style={DefaultStyles.primaryTitleFont}>
          {t('cash.label') + ' $'}
        </Text>
        <Input onChangeText={this.handleCashChanged} value={cash} containerStyle={{ width: 100 }} keyboardType="numeric" />
      </View>
    );
  };
}

EftposAndCashSplitView.propTypes = {
  balanceToPay: PropTypes.number.isRequired,
  onValuesChanged: PropTypes.func.isRequired,
};

export default translate()(EftposAndCashSplitView);
