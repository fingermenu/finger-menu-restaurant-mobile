// @flow

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

  // onViewMenuPressed = () => {};

  setResetPopupDialogRef = popupDialog => {
    this.resetPopupDialog = popupDialog;
  };

  setPaidPopupDialogRef = popupDialog => {
    this.paidPopupDialog = popupDialog;
  };

  getOrderTotal = () => {
    return this.props.order ? this.props.order.totalPrice : 0;
  };

  getBalanceToPay = () => {
    if (this.state.discount > 0) {
      if (this.state.discountType === '$' && this.state.discount < this.getOrderTotal()) {
        return this.getOrderTotal() - this.state.discount;
      } else if (this.state.discountType === '%' && this.state.discount < 100) {
        return (this.getOrderTotal() * (100 - this.state.discount) / 100).toFixed(2);
      }
    }

    return this.getOrderTotal();
  };

  getDiscountTypes = () => {
    return ['$', '%'];
  };

  getSelectedDiscountType = discountTypeIndex => {
    return this.getDiscountTypes()[discountTypeIndex];
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
        <PopupDialog
          width={400}
          height={200}
          dialogTitle={<DialogTitle title="Reset Table" />}
          dialogAnimation={slideAnimation}
          ref={this.setResetPopupDialogRef}
        >
          <View style={Styles.resetTableDialogContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.resetTableDialogText]}>Are you sure to reset table {name}?</Text>
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
              <Text style={[DefaultStyles.primaryLabelFont, Styles.resetTableDialogText]}>Are you sure to pay table {name} in full?</Text>
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
        <View style={Styles.buttonsContainer}>
          <Button
            title="Full Payment"
            backgroundColor={
              tableState.name === 'Paid' || this.getOrderTotal() === 0 ? DefaultColor.defaultFontColorDisabled : DefaultColor.defaultButtonColor
            }
            onPress={this.onSetTablePaidPressed}
          />
          <Button
            title="Split Payment"
            backgroundColor={tableState.name === 'Paid' || order === null ? DefaultColor.defaultFontColorDisabled : DefaultColor.defaultButtonColor}
            onPress={this.onSetTablePaidPressed}
          />
          <Button
            title="Custom Payment"
            backgroundColor={tableState.name === 'Paid' || order === null ? DefaultColor.defaultFontColorDisabled : DefaultColor.defaultButtonColor}
            onPress={this.onSetTablePaidPressed}
          />
          <Button title="Reset table" backgroundColor={DefaultColor.defaultButtonColor} onPress={this.onResetTablePressed} />
        </View>
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
