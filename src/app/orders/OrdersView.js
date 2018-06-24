// @flow

import React, { Component } from 'react';
import Immutable from 'immutable';
import { ScrollView, SectionList, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Button, Input, Icon } from 'react-native-elements';
import PopupDialog, { DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import { translate } from 'react-i18next';
import OrderItemRow from './OrderItemRow';
import Styles from './Styles';
import { ListItemSeparator } from '../../components/list';
import { DefaultColor, DefaultStyles, getPopupDialogSizes } from '../../style';
import { MenuActionButtonContainer } from '../../components/menuActionButton';
import { MenusProp, OrderItemDetailsProp } from './PropTypes';
import { CustomersProp } from '../../framework/applicationState';

class OrdersView extends Component {
  setConfirmOrderPopupDialogRef = popupDialog => {
    this.confirmOrderPopupDialogRef = popupDialog;
  };

  getCustomerName = (customers, customerId) => {
    const customer = customers.find(_ => _.customerId === customerId);

    if (customer) {
      return customer.name;
    }

    return 'unknown guest';
  };

  getOrderItems = orderItems => {
    const { customers } = this.props;

    return Immutable.fromJS(orderItems)
      .groupBy(item => item.getIn(['customer', 'customerId']))
      .mapEntries(([key, value]) => [
        key,
        {
          data: value.toJS(),
          categoryTitle: this.getCustomerName(customers, key),
          categoryKey: key,
        },
      ])
      .sortBy(_ => _.categoryTitle)
      .valueSeq()
      .toJS();
  };

  handleOrderConfirmed = () => {
    const { onConfirmOrderPressed } = this.props;

    this.confirmOrderPopupDialogRef.dismiss();
    onConfirmOrderPressed();
  };

  handleOrderConfirmedCancelled = () => {
    this.confirmOrderPopupDialogRef.dismiss();
  };

  handleConfirmOrderPressed = () => {
    const { inMemoryOrderItems } = this.props;

    if (inMemoryOrderItems.length > 0) {
      this.confirmOrderPopupDialogRef.show();
    }
  };

  keyExtractor = item => item.orderMenuItemPriceId;

  renderOrderItem = info => {
    const { inMemoryOrderItems, onViewOrderItemPressed, onRemoveOrderPressed, customers } = this.props;
    const isInMemoryOrder = !!inMemoryOrderItems.find(item => item.orderMenuItemPriceId.localeCompare(info.item.orderMenuItemPriceId) === 0);

    return (
      <OrderItemRow
        orderItem={info.item}
        menuItemCurrentPrice={info.item.currentPrice}
        onViewOrderItemPressed={onViewOrderItemPressed}
        onRemoveOrderPressed={onRemoveOrderPressed}
        popupDialog={this.popupDialog}
        orderItemIsEditable={isInMemoryOrder}
        showRemove={isInMemoryOrder}
        backgroundColor={isInMemoryOrder ? null : '#C7C8C9'}
        customers={customers}
      />
    );
  };

  renderSeparator = () => <ListItemSeparator />;

  renderSectionHeader = ({ section }) => {
    return (
      <View style={Styles.sectionHeader}>
        <Icon name="person-outline" color={DefaultColor.iconColor} />
        <Text style={[DefaultStyles.primaryLabelFont, Styles.sectionTitle]}>
          {section.categoryTitle}
        </Text>
      </View>
    );
  };

  render = () => {
    const slideAnimation = new SlideAnimation({
      slideFrom: 'bottom',
    });
    const { t, notes, orderItems, inMemoryOrderItems, tableName, onEndReached, onRefresh, isRefreshing, menus, onNotesChanged } = this.props;
    const popupDialogSize = getPopupDialogSizes();

    return (
      <View style={Styles.container}>
        <PopupDialog
          width={popupDialogSize.width}
          height={popupDialogSize.height}
          dialogTitle={<DialogTitle title={t('placeYourOrder.label')} />}
          dialogAnimation={slideAnimation}
          ref={this.setConfirmOrderPopupDialogRef}
        >
          <View style={Styles.popupDialogContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.popupDialogText]}>
              {t('areYouSureToPlaceYourOrderNow.message')}
            </Text>
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
            {t('table.label').replace('{tableName}', tableName)}
          </Text>
          <Text style={DefaultStyles.primaryLabelFont}>
            {t('yourOrder.label')}
          </Text>
        </View>

        {inMemoryOrderItems.length + orderItems.length > 0 ? (
          <SectionList
            renderItem={this.renderOrderItem}
            renderSectionHeader={this.renderSectionHeader}
            sections={this.getOrderItems(inMemoryOrderItems.concat(orderItems))}
            keyExtractor={this.keyExtractor}
            onEndReached={onEndReached}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            ItemSeparatorComponent={this.renderSeparator}
          />
        ) : (
          orderItems.length === 0 && (
            <ScrollView contentContainerStyle={Styles.emptyOrdersContainer}>
              <Text style={DefaultStyles.primaryLabelFont}>
                {t('noOrdersHaveBeenPlacedYet.message')}
              </Text>
            </ScrollView>
          )
        )}
        <View style={Styles.notesContainer}>
          <Input placeholder={t('notes.placeholder')} value={notes} onChangeText={onNotesChanged} />
        </View>
        <MenuActionButtonContainer menus={menus} />
        {inMemoryOrderItems.length > 0 && (
          <View style={Styles.placeOrderContainer}>
            <Button title={t('placeOrder.button')} backgroundColor={DefaultColor.defaultButtonColor} onPress={this.handleConfirmOrderPressed} />
          </View>
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
  notes: PropTypes.string,
  customers: CustomersProp,
};

OrdersView.defaultProps = {
  notes: null,
  customers: null,
};

export default translate()(OrdersView);
