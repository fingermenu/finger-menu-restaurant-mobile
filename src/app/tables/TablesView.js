// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Text, View, TouchableNative } from 'react-native';
import { TouchableItem } from '@microbusiness/common-react-native';
import { TablesProp } from './PropTypes';
import { Badge } from 'react-native-elements';
import Styles from './Styles';

class TablesView extends Component {
  renderItem = item => {
    return (
      <TouchableItem onPress={() => this.props.onTablePressed(item.item)}>
        <View style={Styles.tableContainer}>
          <Badge
            value={item.item.name}
            textStyle={Styles.tableText}
            component={TouchableNative}
            containerStyle={Styles.tableBadgeContainer}
            wrapperStyle={Styles.tableBadgeWrapper}
          />
          <View style={Styles.tableTextContainer}>
            <Text>{item.item.numberOfAdults}</Text>
            <Text>{item.item.numberOfChildren}</Text>
          </View>
        </View>
      </TouchableItem>
    );
  };

  render = () => {
    return (
      <View style={Styles.container}>
        <View>
          <Text>Manage tables</Text>
        </View>
        <FlatList
          data={this.props.tables}
          keyExtractor={item => {
            return item.id;
          }}
          numColumns={3}
          renderItem={this.renderItem}
        />
        <View style={Styles.tableLegendsContainer}>
          <Badge
            value="T 2"
            textStyle={Styles.tableText}
            component={TouchableNative}
            containerStyle={[Styles.tableBadgeContainer, Styles.tableBadgeTaken]}
            wrapperStyle={Styles.tableBadgeWrapper}
          />
          <Badge
            value="N 3"
            textStyle={Styles.tableText}
            component={TouchableNative}
            containerStyle={[Styles.tableBadgeContainer, Styles.tableBadgeEmpty]}
            wrapperStyle={Styles.tableBadgeWrapper}
          />
          <Badge
            value="R 1"
            textStyle={Styles.tableText}
            component={TouchableNative}
            containerStyle={[Styles.tableBadgeContainer, Styles.tableBadgeReserve]}
            wrapperStyle={Styles.tableBadgeWrapper}
          />
          <Badge
            value="$ 2"
            textStyle={Styles.tableText}
            component={TouchableNative}
            containerStyle={[Styles.tableBadgeContainer, Styles.tableBadgePaid]}
            wrapperStyle={Styles.tableBadgeWrapper}
          />
        </View>
      </View>
    );
  };
}

TablesView.propTypes = {
  menuItems: TablesProp,
  onTablePressed: PropTypes.func.isRequired,
};

export default TablesView;
