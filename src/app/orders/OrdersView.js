// @flow

import Immutable from 'immutable';
import React, { Component } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Button, Input } from 'react-native-elements';
import PopupDialog, { DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import { translate } from 'react-i18next';
import OrderItemRow from './OrderItemRow';
import Styles from './Styles';
import { ListItemSeparator } from '../../components/list';
import { DefaultColor, DefaultStyles } from '../../style';
import { MenuActionButtonContainer } from '../../components/menuActionButton';
import { MenusProp, OrderItemDetailsProp } from './PropTypes';

class OrdersView extends Component {
  setConfirmOrderPopupDialogRef = popupDialog => {
    this.confirmOrderPopupDialogRef = popupDialog;
  };

  handleOrderConfirmedCancelled = () => {
    this.confirmOrderPopupDialogRef.dismiss();
  };

  handleOrderConfirmed = () => {
    this.confirmOrderPopupDialogRef.dismiss();
    this.props.onConfirmOrderPressed();
  };

  handleConfirmOrderPressed = () => {
    if (this.props.inMemoryOrderItems.length > 0) {
      this.confirmOrderPopupDialogRef.show();
    }
  };

  keyExtractor = item => item.id;

  renderOrderItem = info => {
    const isInMemoryOrder = !!this.props.inMemoryOrderItems.find(item => item.id.localeCompare(info.item.id) === 0);

    return (
      <OrderItemRow
        orderItem={info.item}
        menuItemCurrentPrice={info.item.currentPrice}
        onViewOrderItemPressed={this.props.onViewOrderItemPressed}
        onRemoveOrderPressed={this.props.onRemoveOrderPressed}
        popupDialog={this.popupDialog}
        orderItemIsEditable={isInMemoryOrder}
        showRemove={isInMemoryOrder}
      />
    );
  };

  renderSeparator = () => <ListItemSeparator />;

  render = () => {
    const slideAnimation = new SlideAnimation({
      slideFrom: 'bottom',
    });
    const {
      t,
      notes,
      orders,
      inMemoryOrderItems,
      tableName,
      customerName,
      onEndReached,
      onRefresh,
      isRefreshing,
      menus,
      onNotesChanged,
    } = this.props;

    return (
      <View style={Styles.container}>
        <PopupDialog
          width={400}
          height={200}
          dialogTitle={<DialogTitle title={t('placeYourOrder.label')} />}
          dialogAnimation={slideAnimation}
          ref={this.setConfirmOrderPopupDialogRef}
        >
          <View style={Styles.popupDialogContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.popupDialogText]}>{t('areYouSureToPlaceYourOrderNow.message')}</Text>
            <View style={[DefaultStyles.rowContainer, Styles.popupDialogButtonContainer]}>
              <Button
                title={t('placeOrder.button')}
                containerStyle={Styles.buttonContainer}
                buttonStyle={Styles.popupDialogButton}
                onPress={this.handleOrderConfirmed}
              />
              <Button
                title={t('cancel.button')}
                containerStyle={Styles.buttonContainer}
                buttonStyle={Styles.popupDialogButton}
                onPress={this.handleOrderConfirmedCancelled}
              />
            </View>
          </View>
        </PopupDialog>
        <View style={Styles.headerContainer}>
          <Text style={DefaultStyles.primaryTitleFont}>
            {t('table.label').replace('{tableName}', tableName) + (customerName ? ',' + customerName : '')}
          </Text>
          <Text style={DefaultStyles.primaryLabelFont}>{t('yourOrder.label')}</Text>
        </View>

        {inMemoryOrderItems.length + orders.length > 0 ? (
          <FlatList
            data={Immutable.fromJS(inMemoryOrderItems)
              .concat(Immutable.fromJS(orders).flatMap(order => order.get('details')))
              .toJS()}
            renderItem={this.renderOrderItem}
            keyExtractor={this.keyExtractor}
            onEndReached={onEndReached}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            ItemSeparatorComponent={this.renderSeparator}
          />
        ) : (
          orders.length === 0 && (
            <ScrollView contentContainerStyle={Styles.emptyOrdersContainer}>
              <Text style={DefaultStyles.primaryLabelFont}>{t('noOrdersHaveBeenPlacedYet.message')}</Text>
            </ScrollView>
          )
        )}
        <Input placeholder={t('notes.placeholder')} value={notes} onChangeText={onNotesChanged} />
        <MenuActionButtonContainer menus={menus} />
        {inMemoryOrderItems.length > 0 && (
          <Button title={t('placeOrder.button')} backgroundColor={DefaultColor.defaultButtonColor} onPress={this.handleConfirmOrderPressed} />
        )}
      </View>
    );
  };
}

OrdersView.propTypes = {
  isRefreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onEndReached: PropTypes.func.isRequired,
  inMemoryOrderItems: OrderItemDetailsProp.isRequired,
  onViewOrderItemPressed: PropTypes.func.isRequired,
  onRemoveOrderPressed: PropTypes.func.isRequired,
  onConfirmOrderPressed: PropTypes.func.isRequired,
  onNotesChanged: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired,
  menus: MenusProp.isRequired,
  customerName: PropTypes.string,
  notes: PropTypes.string,
};

OrdersView.defaultProps = {
  customerName: null,
  notes: null,
};

export default translate()(OrdersView);
