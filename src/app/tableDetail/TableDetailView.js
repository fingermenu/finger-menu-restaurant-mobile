// @flow

import Immutable from 'immutable';
import React, { Component } from 'react';
import { FlatList, ScrollView, Text, TouchableNative, View } from 'react-native';
import PropTypes from 'prop-types';
import { Badge, Button, ButtonGroup, Input } from 'react-native-elements';
import PopupDialog, { DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import OrderItemRow from '../orders/OrderItemRow';
import Styles from './Styles';
import { DefaultColor, DefaultStyles } from '../../style';
import { TableProp } from './PropTypes';

class TableDetailView extends Component {
  constructor() {
    super();
    this.state = {
      selectedDiscountButtonIndex: 0,
      discount: 0,
      discountType: '$',
      selectedOrders: Immutable.fromJS([]),
      isCustomPaymentMode: false,
    };
  }

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
    if (this.props.table.tableState.name === 'Taken') {
      this.paidPopupDialog.show();
    }
  };

  onCustomPayPressed = () => {
    this.setState({ isCustomPaymentMode: true });
  };

  onCancelCustomPayPressed = () => {
    this.setState({ isCustomPaymentMode: false, selectedOrders: Immutable.fromJS([]) });
  };

  onOrderSelected = (order, isSelected) => {
    if (isSelected) {
      const selectedOrder = Immutable.fromJS(order);
      this.setState({ selectedOrders: this.state.selectedOrders.push(selectedOrder) });
    } else {
      this.setState({ selectedOrders: this.state.selectedOrders.filterNot(_ => _.getIn(['menuItemPrice', 'id']) === order.menuItemPrice.id) });
    }
  };

  // onViewMenuPressed = () => {};

  getBalanceToPay = () => {
    const total = this.state.isCustomPaymentMode ? this.getSelectedOrderItemsTotal() : this.getOrderTotal();

    if (this.state.discount > 0) {
      if (this.state.discountType === '$' && this.state.discount < total) {
        return total - this.state.discount;
      } else if (this.state.discountType === '%' && this.state.discount < 100) {
        return (total * (100 - this.state.discount) / 100).toFixed(2);
      }
    }

    return total;
  };

  getSelectedOrderItemsTotal = () => {
    const selectedItemsTotal = this.state.selectedOrders.reduce((v, s) => {
      return (
        v +
        s.get('quantity') *
          (s.getIn(['menuItemPrice', 'currentPrice']) +
            s.get('orderChoiceItemPrices').reduce((ov, os) => {
              return ov + os.getIn(['choiceItemPrice', 'currentPrice']);
            }, 0))
      );
    }, 0);
    return selectedItemsTotal;
  };

  getDiscountTypes = () => {
    return ['$', '%'];
  };

  getSelectedDiscountType = discountTypeIndex => {
    return this.getDiscountTypes()[discountTypeIndex];
  };

  setResetPopupDialogRef = popupDialog => {
    this.resetPopupDialog = popupDialog;
  };

  setPaidPopupDialogRef = popupDialog => {
    this.paidPopupDialog = popupDialog;
  };

  getOrderTotal = () => {
    return this.props.order ? this.props.order.totalPrice : 0;
  };

  getDiscountDisplayValue = () => {
    return this.state.discountType === '%' ? this.state.discount + this.state.discountType : this.state.discountType + this.state.discount;
  };

  updateDiscount = discount => {
    this.setState({ discount });
  };

  updateIndex = selectedDiscountButtonIndex => {
    this.setState({ selectedDiscountButtonIndex, discountType: this.getSelectedDiscountType(selectedDiscountButtonIndex) });
  };

  keyExtractor = item => this.props.order.details.indexOf(item).toString();

  renderResetTablePopupDialog = (slideAnimation, tableName) => {
    return (
      <PopupDialog
        width={400}
        height={200}
        dialogTitle={<DialogTitle title="Reset Table" />}
        dialogAnimation={slideAnimation}
        ref={this.setResetPopupDialogRef}
      >
        <View style={Styles.resetTableDialogContainer}>
          <Text style={[DefaultStyles.primaryLabelFont, Styles.resetTableDialogText]}>Are you sure to reset table {tableName}?</Text>
          <View style={[DefaultStyles.rowContainer, Styles.resetTableDialogButtonContainer]}>
            <Button
              title="No"
              containerStyle={Styles.buttonContainer}
              buttonStyle={Styles.resetTableDialogButton}
              onPress={this.onResetTableCancelled}
            />
            <Button
              title="Yes"
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
    return (
      <PopupDialog
        width={400}
        height={300}
        dialogTitle={<DialogTitle title="Full Payment" />}
        dialogAnimation={slideAnimation}
        ref={this.setPaidPopupDialogRef}
      >
        <View style={Styles.resetTableDialogContainer}>
          <View style={Styles.paymentSummaryTotalRow}>
            <Text style={DefaultStyles.primaryLabelFont}>Total ${this.getOrderTotal()}</Text>
            <Text style={DefaultStyles.primaryLabelFont}>Discount {this.getDiscountDisplayValue()}</Text>
          </View>
          <View style={Styles.paymentSummaryBalanceRow}>
            <Text style={DefaultStyles.primaryTitleFont}>Balance to Pay ${this.getBalanceToPay()}</Text>
          </View>
          <View style={Styles.resetTableDialogButtonContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.resetTableDialogText]}>Are you sure to pay table {tableName} in full?</Text>
          </View>
          <View style={Styles.resetTableDialogButtonContainer}>
            <Button
              title="No"
              containerStyle={Styles.buttonContainer}
              buttonStyle={Styles.resetTableDialogButton}
              onPress={this.onSetTablePaidCancelled}
            />
            <Button
              title="Yes"
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
    return (
      <View style={Styles.buttonsContainer}>
        <Button
          title={'Pay ' + this.state.selectedOrders.count() + ' items'}
          disabled={this.state.selectedOrders.count() === 0}
          onPress={this.onCustomPaymentConfirmPressed}
        />
        <Button title="Cancel Payment" onPress={this.onCancelCustomPayPressed} />
      </View>
    );
  };

  renderDefaultPaymentButtons = (tableState, order) => {
    return (
      <View style={Styles.buttonsContainer}>
        <Button title="Full Payment" disabled={tableState.name === 'Paid' || !order} onPress={this.onSetTablePaidPressed} />
        <Button title="Split Payment" disabled={tableState.name === 'Paid' || !order} onPress={this.onSetTablePaidPressed} />
        <Button title="Custom Payment" disabled={tableState.name === 'Paid' || !order} onPress={this.onCustomPayPressed} />
        <Button title="Reset table" backgroundColor={DefaultColor.defaultButtonColor} onPress={this.onResetTablePressed} />
      </View>
    );
  };

  renderItem = info => {
    const { order, onViewOrderItemPressed, onRemoveOrderPressed } = this.props;

    return (
      <OrderItemRow
        orderItem={info.item}
        orderItemId={order.id}
        menuItem={info.item.menuItemPrice.menuItem}
        menuItemCurrentPrice={info.item.menuItemPrice.currentPrice}
        onViewOrderItemPressed={onViewOrderItemPressed}
        onRemoveOrderPressed={onRemoveOrderPressed}
        enableMultiSelection={this.state.isCustomPaymentMode}
        onOrderSelected={this.onOrderSelected}
        isSelected={this.state.selectedOrders.find(_ => _.getIn(['menuItemPrice', 'id']) === info.item.menuItemPrice.id)}
        isPaid={false}
      />
    );
  };

  render = () => {
    const { table: { name, tableState }, order, onEndReached, onRefresh, isFetchingTop } = this.props;
    const slideAnimation = new SlideAnimation({
      slideFrom: 'bottom',
    });
    const { selectedDiscountButtonIndex } = this.state;

    return (
      <View style={Styles.container}>
        {this.renderResetTablePopupDialog(slideAnimation, name)}
        {this.renderFullPaymentPopupDialog(slideAnimation, name)}

        <View style={Styles.headerContainer}>
          <Text style={DefaultStyles.primaryTitleFont}>Table : {name}</Text>
          <Badge
            value={tableState.name}
            textStyle={Styles.tableText}
            component={TouchableNative}
            containerStyle={[Styles.tableBadgeContainer, Styles.tableBadgeTaken]}
            wrapperStyle={Styles.tableBadgeWrapper}
          />
          <Text style={DefaultStyles.primaryTitleFont}>${this.getOrderTotal()}</Text>
        </View>
        {order && order.details ? (
          <FlatList
            data={order.details}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            onEndReached={onEndReached}
            onRefresh={onRefresh}
            refreshing={isFetchingTop}
            extraData={this.state}
          />
        ) : (
          <ScrollView contentContainerStyle={Styles.emptyOrdersContainer}>
            <Text style={DefaultStyles.primaryLabelFont}>No orders have been placed yet.</Text>
          </ScrollView>
        )}
        <View style={Styles.paymentSummaryContainer}>
          <View style={Styles.paymentSummaryTotalRow}>
            <Text style={DefaultStyles.primaryLabelFont}>Total ${this.getOrderTotal()}</Text>
            <View style={DefaultStyles.rowContainer}>
              <Input
                placeholder="Discount"
                onChangeText={this.updateDiscount}
                value={this.state.discount}
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
            <Text style={DefaultStyles.primaryLabelFont}>Balance To Pay ${this.getBalanceToPay()}</Text>
          </View>
        </View>
        {this.state.isCustomPaymentMode ? this.renderCustomPaymentButtons() : this.renderDefaultPaymentButtons(tableState, order)}
      </View>
    );
  };
}

TableDetailView.propTypes = {
  table: TableProp.isRequired,
  onResetTablePressed: PropTypes.func.isRequired,
  onSetPaidPressed: PropTypes.func.isRequired,
  onViewOrderItemPressed: PropTypes.func.isRequired,
  onRemoveOrderPressed: PropTypes.func.isRequired,
};

export default TableDetailView;
