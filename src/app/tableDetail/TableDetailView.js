// @flow

import React, { Component } from 'react';
import { FlatList, ScrollView, Text, TouchableNative, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import PropTypes from 'prop-types';
import { Badge, Button, Icon } from 'react-native-elements';
import PopupDialog, { DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import OrderItemRow from '../orders/OrderItemRow';
import Styles from './Styles';
import { DefaultColor, DefaultStyles } from '../../style';
import { TableProp } from './PropTypes';

class TableDetailView extends Component {
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

  onViewMenuPressed = () => {};

  setResetPopupDialogRef = popupDialog => {
    this.resetPopupDialog = popupDialog;
  };

  setPaidPopupDialogRef = popupDialog => {
    this.paidPopupDialog = popupDialog;
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
              <Button title="No" buttonStyle={Styles.resetTableDialogButton} onPress={this.onResetTableCancelled} />
              <Button title="Yes" buttonStyle={Styles.resetTableDialogButton} onPress={this.onResetTableConfirmed} />
            </View>
          </View>
        </PopupDialog>
        <PopupDialog
          width={400}
          height={200}
          dialogTitle={<DialogTitle title="Set Table Payment" />}
          dialogAnimation={slideAnimation}
          ref={this.setPaidPopupDialogRef}
        >
          <View style={Styles.resetTableDialogContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.resetTableDialogText]}>Are you sure to set table {name} paid?</Text>
            <View style={[DefaultStyles.rowContainer, Styles.resetTableDialogButtonContainer]}>
              <Button title="No" buttonStyle={Styles.resetTableDialogButton} onPress={this.onSetTablePaidCancelled} />
              <Button title="Yes" buttonStyle={Styles.resetTableDialogButton} onPress={this.onSetTablePaidConfirmed} />
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
          <Text style={DefaultStyles.primaryTitleFont}>${order ? order.totalPrice : 0}</Text>
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

        <View style={Styles.buttonsContainer}>
          <Button
            title="Set paid"
            backgroundColor={tableState.name === 'Paid' ? DefaultColor.defaultFontColorDisabled : DefaultColor.defaultButtonColor}
            onPress={this.onSetTablePaidPressed}
          />
          <Button title="Reset table" backgroundColor={DefaultColor.defaultButtonColor} onPress={this.onResetTablePressed} />
        </View>
        <ActionButton buttonColor={DefaultColor.actionButtonColor} offsetX={50}>
          <ActionButton.Item buttonColor="#9b59b6" title="Drink" onPress={this.onViewMenuPressed}>
            <Icon name="md-create" type="ionicon" style={Styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor="#3498db" title="Desert" onPress={this.onViewMenuPressed}>
            <Icon name="md-notifications-off" type="ionicon" style={Styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor="#1abc9c" title="Kids Menu" onPress={this.onViewMenuPressed}>
            <Icon name="md-done-all" type="ionicon" style={Styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
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
