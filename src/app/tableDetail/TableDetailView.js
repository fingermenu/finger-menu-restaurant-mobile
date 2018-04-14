// @flow

import Immutable, { List } from 'immutable';
import React, { Component } from 'react';
import { FlatList, ScrollView, Text, TouchableNative, View } from 'react-native';
import PropTypes from 'prop-types';
import { Badge, Button, ButtonGroup, Input } from 'react-native-elements';
import PopupDialog, { DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import { translate } from 'react-i18next';
import OrderItemRow from '../orders/OrderItemRow';
import Styles from './Styles';
import { DefaultColor, DefaultStyles, PopupDialogSize } from '../../style';
import { TableProp } from './PropTypes';

class TableDetailView extends Component {
  state = {
    selectedDiscountButtonIndex: 0,
    discount: '',
    discountType: '$',
    selectedOrders: List(),
    isCustomPaymentMode: false,
  };

  getTotal = () => (this.state.isCustomPaymentMode ? this.getCalculatedOrderItemsTotal(this.state.selectedOrders) : this.getRemainingTotal());

  getBalanceToPay = () => {
    const total = this.getTotal();
    const discount = this.convertStringDiscountValueToDecimal();
    const { discountType } = this.state;

    if (discount > 0) {
      if (discountType === '$' && discount < total) {
        return total - discount;
      } else if (discountType === '%' && discount < 100) {
        return total * (100 - discount) / 100;
      }
    }

    return total;
  };

  getCalculatedOrderItemsTotal = orderItems =>
    orderItems.reduce(
      (reduction, value) =>
        reduction +
        value.get('quantity') *
          (value.getIn(['menuItemPrice', 'currentPrice']) +
            value.get('orderChoiceItemPrices').reduce((ov, os) => ov + os.getIn(['choiceItemPrice', 'currentPrice']), 0.0)),
      0.0,
    );

  getDiscountTypes = () => ['$', '%'];

  getSelectedDiscountType = discountTypeIndex => this.getDiscountTypes()[discountTypeIndex];

  setResetPopupDialogRef = popupDialog => {
    this.resetPopupDialog = popupDialog;
  };

  setPaidPopupDialogRef = popupDialog => {
    this.paidPopupDialog = popupDialog;
  };

  setCustomPaidPopupDialogRef = popupDialog => {
    this.customPaidPopupDialog = popupDialog;
  };

  getOrderTotal = () => this.props.orders.reduce((totalPrice, order) => totalPrice + order.totalPrice, 0);

  getRemainingTotal = () =>
    this.props.orders.reduce(
      (remainingTotal, order) =>
        remainingTotal +
        this.getCalculatedOrderItemsTotal(
          Immutable.fromJS(order)
            .get('details')
            .filterNot(_ => _.get('paid')),
        ),
      0,
    );

  getDiscountDisplayValue = () => {
    const discount = this.convertStringDiscountValueToDecimal();
    const { discountType } = this.state;

    return discountType === '%' ? (discount ? discount : '0') + discountType : discountType + (discount ? discount.toFixed(2) : '0.00');
  };

  convertStringDiscountValueToDecimal = () => {
    const discount = parseFloat(this.state.discount ? this.state.discount.trim() : '');

    return discount ? discount : 0;
  };

  isDiscountValid = () => {
    const discount = this.convertStringDiscountValueToDecimal();
    const { discountType } = this.state;

    if (discount >= 0) {
      if (discountType === '$' && discount <= this.getTotal()) {
        return true;
      } else if (discountType === '%' && discount <= 100) {
        return true;
      }

      return false;
    }

    return false;
  };

  handleResetTableConfirmed = () => {
    this.resetPopupDialog.dismiss();
    this.props.onResetTablePressed();
  };

  handleResetTableCancelled = () => {
    this.resetPopupDialog.dismiss();
  };

  handleResetTablePressed = () => this.resetPopupDialog.show();

  handleSetTablePaidConfirmed = () => {
    this.paidPopupDialog.dismiss();
    this.setState({ selectedOrders: List() });
    this.props.onSetPaidPressed();
  };

  handleSetTablePaidAndResetConfirmed = () => {
    this.paidPopupDialog.dismiss();
    this.setState({ selectedOrders: List() });
    this.props.onSetPaidAndResetPressed();
  };

  handleSetTablePaidCancelled = () => {
    this.paidPopupDialog.dismiss();
  };

  handleSetTablePaidPressed = () => {
    if (this.props.table.tableState.key === 'taken') {
      this.paidPopupDialog.show();
    }
  };

  handleCustomPayPressed = () => {
    this.setState({ isCustomPaymentMode: true });
  };

  handlePayCustomPayPressed = () => {
    this.customPaidPopupDialog.show();
  };

  handleCancelCustomPayPressed = () => {
    this.setState({ isCustomPaymentMode: false, selectedOrders: List() });
  };

  handlePayCustomConfirmed = () => {
    this.customPaidPopupDialog.dismiss();

    const { selectedOrders } = this.state;

    this.setState({ selectedOrders: List() });
    this.props.onCustomPaidPressed(selectedOrders);
  };

  handlePayCustomCancelled = () => {
    this.customPaidPopupDialog.dismiss();
  };

  handleOrderSelected = (order, isSelected) => {
    if (isSelected) {
      this.setState({ selectedOrders: this.state.selectedOrders.push(Immutable.fromJS(order)) });
    } else {
      this.setState({ selectedOrders: this.state.selectedOrders.filterNot(_ => _.get('id') === order.id) });
    }
  };

  updateDiscount = discount => {
    this.setState({ discount });
  };

  updateIndex = selectedDiscountButtonIndex => {
    this.setState({ selectedDiscountButtonIndex, discountType: this.getSelectedDiscountType(selectedDiscountButtonIndex) });
  };

  keyExtractor = item => item.id;

  selectedOrdersKeyExtractor = item => item.id;

  renderCustomPaymentPopupDialog = (slideAnimation, tableName) => {
    const { t } = this.props;

    return (
      <PopupDialog
        width={PopupDialogSize.width}
        height={PopupDialogSize.height}
        dialogTitle={<DialogTitle title={t('customPayment.label') + ' ' + tableName} />}
        dialogAnimation={slideAnimation}
        ref={this.setCustomPaidPopupDialogRef}
      >
        <View style={Styles.customPayDialogContainer}>
          <FlatList
            data={this.state.selectedOrders.toJS()}
            renderItem={this.renderSelectedPayingItem}
            keyExtractor={this.selectedOrdersKeyExtractor}
            extraData={this.state}
          />
          <View>
            <View style={Styles.paymentSummaryTotalRow}>
              <Text style={DefaultStyles.primaryLabelFont}>
                {t('total.label').replace('{total}', this.getCalculatedOrderItemsTotal(this.state.selectedOrders).toFixed(2))}
              </Text>
              <Text style={DefaultStyles.primaryLabelFont}>{t('discount.label').replace('{discount}', this.getDiscountDisplayValue())}</Text>
            </View>
            <View style={Styles.paymentSummaryBalanceRow}>
              <Text style={DefaultStyles.primaryTitleFont}>
                {t('balanceToPay.label').replace('{balanceToPay}', this.getBalanceToPay().toFixed(2))}
              </Text>
            </View>
            <View style={Styles.centeredRowContainer}>
              <Text style={[DefaultStyles.primaryLabelFont, Styles.resetTableDialogText]}>{t('confirmPayment.message')}</Text>
            </View>
            <View style={Styles.centeredRowContainer}>
              <Button
                title={t('confirm.button')}
                containerStyle={Styles.buttonContainer}
                buttonStyle={Styles.button}
                onPress={this.handlePayCustomConfirmed}
              />
              <Button
                title={t('cancel.button')}
                containerStyle={Styles.buttonContainer}
                buttonStyle={Styles.button}
                onPress={this.handlePayCustomCancelled}
              />
            </View>
          </View>
        </View>
      </PopupDialog>
    );
  };

  renderResetTablePopupDialog = (slideAnimation, tableName) => {
    const { t } = this.props;

    return (
      <PopupDialog
        width={PopupDialogSize.width}
        height={PopupDialogSize.height}
        dialogTitle={<DialogTitle title={t('resetTable.label')} />}
        dialogAnimation={slideAnimation}
        ref={this.setResetPopupDialogRef}
      >
        <View style={Styles.resetTableDialogContainer}>
          <Text style={[DefaultStyles.primaryLabelFont, Styles.resetTableDialogText]}>
            {t('areYouSureToResetTable.message').replace('{tableName}', tableName)}
          </Text>
          <View style={[DefaultStyles.rowContainer, Styles.centeredRowContainer]}>
            <Button
              title={t('resetTable.button')}
              containerStyle={Styles.buttonContainer}
              buttonStyle={Styles.button}
              onPress={this.handleResetTableConfirmed}
            />
            <Button
              title={t('cancel.button')}
              containerStyle={Styles.buttonContainer}
              buttonStyle={Styles.button}
              onPress={this.handleResetTableCancelled}
            />
          </View>
        </View>
      </PopupDialog>
    );
  };

  renderFullPaymentPopupDialog = (slideAnimation, tableName) => {
    const { t } = this.props;

    return (
      <PopupDialog
        width={PopupDialogSize.width}
        height={PopupDialogSize.height}
        dialogTitle={<DialogTitle title={t('fullPayment.label')} />}
        dialogAnimation={slideAnimation}
        ref={this.setPaidPopupDialogRef}
      >
        <View style={Styles.resetTableDialogContainer}>
          <View style={Styles.paymentSummaryTotalRow}>
            <Text style={DefaultStyles.primaryLabelFont}>{t('total.label').replace('{total}', this.getRemainingTotal().toFixed(2))}</Text>
            <Text style={DefaultStyles.primaryLabelFont}>{t('discount.label').replace('{discount}', this.getDiscountDisplayValue())}</Text>
          </View>
          <View style={Styles.paymentSummaryBalanceRow}>
            <Text style={DefaultStyles.primaryTitleFont}>{t('balanceToPay.label').replace('{balanceToPay}', this.getBalanceToPay().toFixed(2))}</Text>
          </View>
          <View style={Styles.centeredRowContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.resetTableDialogText]}>
              {t('areYouSureToPayTableInFull.message').replace('{tableName}', tableName)}
            </Text>
          </View>
          <View style={Styles.centeredRowContainer}>
            <Button
              title={t('payNow.button')}
              containerStyle={Styles.buttonContainer}
              buttonStyle={Styles.button}
              onPress={this.handleSetTablePaidConfirmed}
            />
            <Button
              title={t('payAndResetTableNow.button')}
              containerStyle={Styles.buttonContainer}
              buttonStyle={Styles.button}
              onPress={this.handleSetTablePaidAndResetConfirmed}
            />
            <Button
              title={t('cancel.button')}
              containerStyle={Styles.buttonContainer}
              buttonStyle={Styles.button}
              onPress={this.handleSetTablePaidCancelled}
            />
          </View>
        </View>
      </PopupDialog>
    );
  };

  renderCustomPaymentButtons = () => {
    const { t } = this.props;

    return (
      <View style={Styles.buttonsContainer}>
        <Button
          title={t('payItems.button').replace('{numberOfItems}', this.state.selectedOrders.count())}
          disabled={this.state.selectedOrders.isEmpty() || !this.isDiscountValid()}
          onPress={this.handlePayCustomPayPressed}
        />
        <Button title={t('cancelPayment.button')} onPress={this.handleCancelCustomPayPressed} />
      </View>
    );
  };

  renderDefaultPaymentButtons = tableState => {
    const { t, orders, onGiveToGuestPressed } = this.props;

    return (
      <View style={Styles.buttonsContainer}>
        <Button
          title={t('fullPayment.button')}
          disabled={tableState.key === 'paid' || orders.length === 0 || !this.isDiscountValid()}
          onPress={this.handleSetTablePaidPressed}
        />
        <Button title={t('customPayment.button')} disabled={tableState.key === 'paid' || orders.length === 0} onPress={this.handleCustomPayPressed} />
        <Button title={t('resetTable.button')} backgroundColor={DefaultColor.defaultButtonColor} onPress={this.handleResetTablePressed} />
        <Button title={t('giveToGuest.button')} disabled={tableState.key !== 'taken'} onPress={onGiveToGuestPressed} />
      </View>
    );
  };

  renderOrderItemRow = info => (
    <OrderItemRow
      orderItem={info.item}
      menuItem={info.item.menuItemPrice.menuItem}
      menuItemCurrentPrice={info.item.menuItemPrice.currentPrice}
      enableMultiSelection={this.state.isCustomPaymentMode}
      onOrderSelected={this.handleOrderSelected}
      isSelected={!!this.state.selectedOrders.find(_ => _.get('id') === info.item.id)}
      orderItemIsEditable
      showRemove={false}
    />
  );

  renderSelectedPayingItem = info => (
    <OrderItemRow
      orderItem={info.item}
      menuItemCurrentPrice={info.item.menuItemPrice.currentPrice}
      enableMultiSelection={false}
      orderItemIsEditable
      showRemove={false}
      showImage={false}
    />
  );

  render = () => {
    const {
      t,
      table: { name, tableState },
      orders,
      onEndReached,
      onRefresh,
      isRefreshing,
    } = this.props;
    const slideAnimation = new SlideAnimation({ slideFrom: 'bottom' });
    const { selectedDiscountButtonIndex } = this.state;

    return (
      <View style={Styles.container}>
        {this.renderResetTablePopupDialog(slideAnimation, name)}
        {this.renderFullPaymentPopupDialog(slideAnimation, name)}
        {this.renderCustomPaymentPopupDialog(slideAnimation, name)}

        <View style={Styles.headerContainer}>
          <Text style={DefaultStyles.primaryTitleFont}>{t('table.label').replace('{tableName}', name)}</Text>
          <Badge
            value={tableState.name}
            textStyle={Styles.tableText}
            component={TouchableNative}
            containerStyle={[Styles.tableBadgeContainer, Styles.tableBadgeTaken]}
            wrapperStyle={Styles.tableBadgeWrapper}
          />
          <Text style={DefaultStyles.primaryTitleFont}>${this.getOrderTotal().toFixed(2)}</Text>
        </View>
        {orders.length > 0 ? (
          <FlatList
            data={Immutable.fromJS(orders)
              .flatMap(order => order.get('details'))
              .toJS()}
            renderItem={this.renderOrderItemRow}
            keyExtractor={this.keyExtractor}
            onEndReached={onEndReached}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            extraData={this.state}
          />
        ) : (
          <ScrollView contentContainerStyle={Styles.emptyOrdersContainer}>
            <Text style={DefaultStyles.primaryLabelFont}>{t('noOrdersHaveBeenPlacedYet.message')}</Text>
          </ScrollView>
        )}
        <View style={Styles.paymentSummaryContainer}>
          <View style={Styles.paymentSummaryTotalRow}>
            <Text style={DefaultStyles.primaryLabelFont}>{t('total.label').replace('{total}', this.getOrderTotal().toFixed(2))}</Text>
            <View style={DefaultStyles.rowContainer}>
              <Input
                placeholder={t('discount.placeholder')}
                onChangeText={this.updateDiscount}
                value={this.state.discount}
                containerStyle={{ width: 100 }}
                keyboardType="numeric"
              />
              <ButtonGroup
                onPress={this.updateIndex}
                selectedIndex={selectedDiscountButtonIndex}
                buttons={this.getDiscountTypes()}
                containerStyle={{ height: 30, width: 100 }}
              />
            </View>
          </View>
          <View style={Styles.paymentSummaryBalanceRow}>
            <Text style={DefaultStyles.primaryLabelFont}>{t('balanceToPay.label').replace('{balanceToPay}', this.getBalanceToPay().toFixed(2))}</Text>
          </View>
        </View>
        {this.state.isCustomPaymentMode ? this.renderCustomPaymentButtons() : this.renderDefaultPaymentButtons(tableState)}
      </View>
    );
  };
}

TableDetailView.propTypes = {
  isRefreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onEndReached: PropTypes.func.isRequired,
  table: TableProp.isRequired,
  onResetTablePressed: PropTypes.func.isRequired,
  onSetPaidPressed: PropTypes.func.isRequired,
  onSetPaidAndResetPressed: PropTypes.func.isRequired,
  onCustomPaidPressed: PropTypes.func.isRequired,
  onGiveToGuestPressed: PropTypes.func.isRequired,
};

export default translate()(TableDetailView);
