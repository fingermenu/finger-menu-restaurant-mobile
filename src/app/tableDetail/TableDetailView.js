// @flow

import React, { Component } from 'react';
import { FlatList, ScrollView, Text, TouchableNative, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import PropTypes from 'prop-types';
import { Badge, Button, Icon } from 'react-native-elements';
import OrderItemRow from '../orders/OrderItemRow';
import Styles from './Styles';
import { DefaultColor, DefaultStyles } from '../../style';
import { TableProp } from './PropTypes';

class TableDetailView extends Component {
  keyExtractor = item => item.id;

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
    const { table: { name, tableState }, order, onEndReached, onRefresh, isFetchingTop, onResetTablePressed } = this.props;

    return (
      <View style={Styles.container}>
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
          <Button title="Set paid" backgroundColor={DefaultColor.defaultButtonColor} />
          <Button title="Reset table" backgroundColor={DefaultColor.defaultButtonColor} onPress={onResetTablePressed} />
        </View>
        <ActionButton buttonColor={DefaultColor.actionButtonColor} offsetX={50}>
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
      </View>
    );
  };
}

TableDetailView.propTypes = {
  table: TableProp.isRequired,
  onResetTablePressed: PropTypes.func.isRequired,
  onViewOrderItemPressed: PropTypes.func.isRequired,
  onRemoveOrderPressed: PropTypes.func.isRequired,
};

export default TableDetailView;
