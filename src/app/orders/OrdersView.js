// @flow

import React, { Component } from 'react';
import { FlatList, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Button } from 'react-native-elements';
import OrderItemRow from './OrderItemRow';
import Styles from './Styles';
import { ListItemSeparator } from '../../components/list';
import { DefaultColor } from '../../style';

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
          <Text>Table # 3</Text>
          <Text>Your Orders</Text>
        </View>

        <FlatList
          data={this.props.orders}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          onEndReached={this.props.onEndReached}
          onRefresh={this.props.onRefresh}
          refreshing={this.props.isFetchingTop}
          ItemSeparatorComponent={this.renderSeparator}
        />
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
};

export default OrdersView;
