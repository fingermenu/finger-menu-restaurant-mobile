// @flow

import React, { Component } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Button, Icon } from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import OrderItemRow from './OrderItemRow';
import Styles from './Styles';
import { ListItemSeparator } from '../../components/list';
import { DefaultColor, DefaultStyles } from '../../style';

class OrdersView extends Component {
  keyExtractor = item => item.orderItemId;

  renderItem = info => (
    <OrderItemRow
      orderItem={info.item.data}
      orderItemId={info.item.orderItemId}
      menuItem={info.item.data.menuItem}
      menuItemCurrentPrice={info.item.data.currentPrice}
      onViewOrderItemPressed={this.props.onViewOrderItemPressed}
      onRemoveOrderPressed={this.props.onRemoveOrderPressed}
    />
  );

  renderSeparator = () => <ListItemSeparator />;

  render = () => {
    return (
      <View style={Styles.container}>
        <View style={Styles.headerContainer}>
          <Text style={DefaultStyles.primaryTitleFont}>
            Table {this.props.tableName} {this.props.customerName}
          </Text>
          <Text style={DefaultStyles.primaryLabelFont}>Your Orders</Text>
        </View>

        {this.props.orders.length > 0 ? (
          <FlatList
            data={this.props.orders}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            onEndReached={this.props.onEndReached}
            onRefresh={this.props.onRefresh}
            refreshing={this.props.isFetchingTop}
            ItemSeparatorComponent={this.renderSeparator}
          />
        ) : (
          <ScrollView contentContainerStyle={Styles.emptyOrdersContainer}>
            <Text style={DefaultStyles.primaryLabelFont}>No orders have been placed yet.</Text>
          </ScrollView>
        )}

        <ActionButton buttonColor={DefaultColor.actionButtonColor} offsetX={50} offsetY={60}>
          <ActionButton.Item buttonColor="#9b59b6" title="Drink">
            <Icon name="md-create" type="ionicon" style={Styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor="#3498db" title="Desert">
            <Icon name="md-notifications-off" type="ionicon" style={Styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor="#1abc9c" title="Kids">
            <Icon name="md-done-all" type="ionicon" style={Styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
        <Button
          title="Confirm Order"
          icon={{ name: 'md-checkmark', type: 'ionicon' }}
          backgroundColor={DefaultColor.defaultButtonColor}
          onPress={this.props.onConfirmOrderPressed}
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
  customerName: PropTypes.string.isRequired,
};

export default OrdersView;
