// @flow

import React, { Component } from 'react';
import { FlatList, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import OrderItemRow from './OrderItemRow';
import { Button } from 'react-native-elements';
import Styles from './Styles';
import { OrdersProp } from './PropTypes';
import { ListItemSeparator } from '../../components/list';
import { DefaultColor } from '../../style';

class OrdersView extends Component {
  render = () => {
    return (
      <View style={Styles.container}>
        <View style={Styles.headerContainer}>
          <Text>Table # 3</Text>
          <Text>Your Orders</Text>
        </View>

        <FlatList
          data={this.props.orders}
          renderItem={info => (
            <OrderItemRow
              orderItem={info.item}
              onViewOrderItemPressed={this.props.onViewOrderItemPressed}
              onRemoveOrderPressed={this.props.onRemoveOrderPressed}
            />
          )}
          keyExtractor={item => item.id}
          onEndReached={this.props.onEndReached}
          onRefresh={this.props.onRefresh}
          refreshing={this.props.isFetchingTop}
          ItemSeparatorComponent={() => <ListItemSeparator />}
        />
        <Button
          title="Confirm Order"
          disabled={this.props.orders.length === 0}
          icon={{ name: 'md-checkmark', type: 'ionicon' }}
          backgroundColor={DefaultColor.defaultButtonColor}
          onPress={this.props.onConfirmOrderPressed}
        />
      </View>
    );
  };
}

OrdersView.propTypes = {
  orders: OrdersProp,
  onViewOrderItemPressed: PropTypes.func.isRequired,
  onRemoveOrderPressed: PropTypes.func.isRequired,
  onConfirmOrderPressed: PropTypes.func.isRequired,
};

export default OrdersView;
