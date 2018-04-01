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
import { DefaultColor, DefaultStyles } from '../../style';
import { TableProp } from './PropTypes';

class TableDetailView extends Component {
  state = {
    selectedDiscountButtonIndex: 0,
    discount: 0,
    discountType: '$',
    selectedOrders: List(),
    isCustomPaymentMode: false,
  };

  onResetTableConfirmed = () => {
    this.resetPopupDialog.dismiss();
    this.props.onResetTablePressed();
  };

  onResetTableCancelled = () => {
    this.resetPopupDialog.dismiss();
  };

  onResetTablePressed = () => this.resetPopupDialog.show();

  onSetTablePaidConfirmed = () => {
    this.paidPopupDialog.dismiss();
    this.props.onSetPaidPressed();
  };

  onSetTablePaidCancelled = () => {
    this.paidPopupDialog.dismiss();
  };

  onSetTablePaidPressed = () => {
    if (this.props.table.tableState.key === 'taken') {
      this.paidPopupDialog.show();
    }
  };

  onCustomPayPressed = () => {
    this.setState({ isCustomPaymentMode: true });
  };

  onPayCustomPayPressed = () => {
    this.customPaidPopupDialog.show();
  };

  onCancelCustomPayPressed = () => {
    this.setState({ isCustomPaymentMode: false, selectedOrders: List() });
  };

  onPayCustomConfirmed = () => {
    this.customPaidPopupDialog.dismiss();
    this.props.onCustomPaidPressed(this.state.selectedOrders);
  };

  onPayCustomCancelled = () => {
    this.customPaidPopupDialog.dismiss();
  };

  getBalanceToPay = () => {
    const total = this.state.isCustomPaymentMode ? this.getCalculatedOrderItemsTotal(this.state.selectedOrders) : this.getRemainingTotal();

    if (this.state.discount > 0) {
      if (this.state.discountType === '$' && this.state.discount < total) {
        return total - this.state.discount;
      } else if (this.state.discountType === '%' && this.state.discount < 100) {
        return total * (100 - this.state.discount) / 100;
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

  getOrderTotal = () => (this.props.order ? this.props.order.totalPrice : 0);

  getRemainingTotal = () => {
    if (this.props.order) {
      return this.getCalculatedOrderItemsTotal(
        Immutable.fromJS(this.props.order)
          .get('details')
          .filterNot(_ => _.get('paid')),
      );
    }

    return 0.0;
  };

  getDiscountDisplayValue = () =>
    this.state.discountType === '%'
      ? (this.state.discount ? this.state.discount : '0') + this.state.discountType
      : this.state.discountType + (this.state.discount ? this.state.discount.toFixed(2) : '0.00');

  handleOrderSelected = (order, isSelected) => {
    if (isSelected) {
      this.setState({ selectedOrders: this.state.selectedOrders.push(Immutable.fromJS(order)) });
    } else {
      this.setState({ selectedOrders: this.state.selectedOrders.filterNot(_ => _.get('id') === order.id) });
    }
  };

  updateDiscount = discount => {
    this.setState({ discount: discount ? parseFloat(discount) : 0.0 });
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
        width={400}
        height={500}
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
            <View style={Styles.resetTableDialogButtonContainer}>
              <Text style={[DefaultStyles.primaryLabelFont, Styles.resetTableDialogText]}>{t('confirmPayment.message')}</Text>
            </View>
            <View style={Styles.resetTableDialogButtonContainer}>
              <Button
                title={t('no.button')}
                containerStyle={Styles.buttonContainer}
                buttonStyle={Styles.resetTableDialogButton}
                onPress={this.onPayCustomCancelled}
              />
              <Button
                title={t('yes.button')}
                containerStyle={Styles.buttonContainer}
                buttonStyle={Styles.resetTableDialogButton}
                onPress={this.onPayCustomConfirmed}
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
        width={400}
        height={200}
        dialogTitle={<DialogTitle title={t('resetTable.label')} />}
        dialogAnimation={slideAnimation}
        ref={this.setResetPopupDialogRef}
      >
        <View style={Styles.resetTableDialogContainer}>
          <Text style={[DefaultStyles.primaryLabelFont, Styles.resetTableDialogText]}>
            {t('areYouSureToResetTable.message').replace('{tableName}', tableName)}
          </Text>
          <View style={[DefaultStyles.rowContainer, Styles.resetTableDialogButtonContainer]}>
            <Button
              title={t('no.button')}
              containerStyle={Styles.buttonContainer}
              buttonStyle={Styles.resetTableDialogButton}
              onPress={this.onResetTableCancelled}
            />
            <Button
              title={t('yes.button')}
              containerStyle={Styles.buttonContainer}
              buttonStyle={Styles.resetTableDialogButton}
              onPress={this.onResetTableConfirmed}
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
        width={400}
        height={300}
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
          <View style={Styles.resetTableDialogButtonContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.resetTableDialogText]}>
              {t('areYouSureToPayTableInFull.message').replace('{tableName}', tableName)}
            </Text>
          </View>
          <View style={Styles.resetTableDialogButtonContainer}>
            <Button
              title={t('no.button')}
              containerStyle={Styles.buttonContainer}
              buttonStyle={Styles.resetTableDialogButton}
              onPress={this.onSetTablePaidCancelled}
            />
            <Button
              title={t('yes.button')}
              containerStyle={Styles.buttonContainer}
              buttonStyle={Styles.resetTableDialogButton}
              onPress={this.onSetTablePaidConfirmed}
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
          disabled={this.state.selectedOrders.isEmpty()}
          onPress={this.onPayCustomPayPressed}
        />
        <Button title={t('cancelPayment.button')} onPress={this.onCancelCustomPayPressed} />
      </View>
    );
  };

  renderDefaultPaymentButtons = (tableState, order) => {
    const { t } = this.props;

    return (
      <View style={Styles.buttonsContainer}>
        <Button title={t('fullPayment.button')} disabled={tableState.key === 'paid' || !order} onPress={this.onSetTablePaidPressed} />
        <Button title={t('splitPayment.button')} disabled={tableState.key === 'paid' || !order} onPress={this.onSetTablePaidPressed} />
        <Button title={t('customPayment.button')} disabled={tableState.key === 'paid' || !order} onPress={this.onCustomPayPressed} />
        <Button title={t('resetTable.button')} backgroundColor={DefaultColor.defaultButtonColor} onPress={this.onResetTablePressed} />
      </View>
    );
  };

  renderOrderItemRow = info => {
    const { onViewOrderItemPressed, onRemoveOrderPressed } = this.props;

    return (
      <OrderItemRow
        orderItem={info.item}
        menuItem={info.item.menuItemPrice.menuItem}
        menuItemCurrentPrice={info.item.menuItemPrice.currentPrice}
        onViewOrderItemPressed={onViewOrderItemPressed}
        onRemoveOrderPressed={onRemoveOrderPressed}
        enableMultiSelection={this.state.isCustomPaymentMode}
        onOrderSelected={this.handleOrderSelected}
        isSelected={!!this.state.selectedOrders.find(_ => _.get('id') === info.item.id)}
      />
    );
  };

  renderSelectedPayingItem = info => {
    return (
      <OrderItemRow
        orderItem={info.item}
        menuItemCurrentPrice={info.item.menuItemPrice.currentPrice}
        enableMultiSelection={false}
        onViewOrderItemPressed={() => {}}
        onRemoveOrderPressed={() => {}}
        showRemove={false}
      />
    );
  };

  render = () => {
    const { t, table: { name, tableState }, order, onEndReached, onRefresh, isRefreshing } = this.props;
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
        {order && order.details ? (
          <FlatList
            data={order.details}
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
                value={this.state.discount.toString()}
                containerStyle={{ width: 100 }}
                maxLength={3}
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
        {this.state.isCustomPaymentMode ? this.renderCustomPaymentButtons() : this.renderDefaultPaymentButtons(tableState, order)}
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
  onCustomPaidPressed: PropTypes.func.isRequired,
  onViewOrderItemPressed: PropTypes.func.isRequired,
  onRemoveOrderPressed: PropTypes.func.isRequired,
};

export default translate()(TableDetailView);
