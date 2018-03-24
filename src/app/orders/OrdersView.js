// @flow

import React, { Component } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Button, Icon, Input } from 'react-native-elements';
import PopupDialog, { DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import { translate } from 'react-i18next';
import OrderItemRow from './OrderItemRow';
import Styles from './Styles';
import { ListItemSeparator } from '../../components/list';
import { DefaultColor, DefaultStyles } from '../../style';
import { MenuActionButton } from '../../components/menuActionButton';

class OrdersView extends Component {
  onOrderConfirmed = () => {
    this.confirmOrderPopupDialog.dismiss();
    this.props.onConfirmOrderPressed();
  };

  onOrderConfirmedCancelled = () => {
    this.confirmOrderPopupDialog.dismiss();
  };

  onConfirmOrderPressed = () => {
    if (this.props.orders.length > 0) {
      this.confirmOrderPopupDialog.show();
    }
  };

  setConfirmOrderPopupDialogRef = popupDialog => {
    this.confirmOrderPopupDialog = popupDialog;
  };

  keyExtractor = item => item.orderItemId;

  renderItem = info => (
    <OrderItemRow
      orderItem={info.item.data}
      orderItemId={info.item.orderItemId}
      menuItem={info.item.data.menuItem}
      menuItemCurrentPrice={info.item.data.currentPrice}
      onViewOrderItemPressed={this.props.onViewOrderItemPressed}
      onRemoveOrderPressed={this.props.onRemoveOrderPressed}
      popupDialog={this.popupDialog}
    />
  );

  renderSeparator = () => <ListItemSeparator />;

  render = () => {
    const slideAnimation = new SlideAnimation({
      slideFrom: 'bottom',
    });
    const { t, notes, orders, tableName, customerName, onEndReached, onRefresh, isFetchingTop, restaurantId, onNotesChanged } = this.props;

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
                title={t('no.button')}
                containerStyle={Styles.buttonContainer}
                buttonStyle={Styles.popupDialogButton}
                onPress={this.onOrderConfirmedCancelled}
              />
              <Button
                title={t('yes.button')}
                containerStyle={Styles.buttonContainer}
                buttonStyle={Styles.popupDialogButton}
                onPress={this.onOrderConfirmed}
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

        {orders.length > 0 ? (
          <FlatList
            data={orders}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            onEndReached={onEndReached}
            onRefresh={onRefresh}
            refreshing={isFetchingTop}
            ItemSeparatorComponent={this.renderSeparator}
          />
        ) : (
          <ScrollView contentContainerStyle={Styles.emptyOrdersContainer}>
            <Text style={DefaultStyles.primaryLabelFont}>{t('noOrdersHaveBeenPlacedYet.message')}</Text>
          </ScrollView>
        )}
        <Input placeholder={t('notes.placeholder')} value={notes} onChangeText={onNotesChanged} />
        <MenuActionButton restaurantId={restaurantId} />
        <Button
          title={t('placeOrder.button')}
          icon={<Icon name="md-checkmark" type="ionicon" />}
          backgroundColor={orders.length === 0 ? DefaultColor.defaultFontColorDisabled : DefaultColor.defaultButtonColor}
          onPress={this.onConfirmOrderPressed}
        />
      </View>
    );
  };
}

OrdersView.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object).isRequired,
  onViewOrderItemPressed: PropTypes.func.isRequired,
  onRemoveOrderPressed: PropTypes.func.isRequired,
  onConfirmOrderPressed: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired,
  restaurantId: PropTypes.string.isRequired,
  onNotesChanged: PropTypes.func.isRequired,
  customerName: PropTypes.string,
  notes: PropTypes.string,
};

OrdersView.defaultProps = {
  customerName: null,
  notes: null,
};

export default translate()(OrdersView);
