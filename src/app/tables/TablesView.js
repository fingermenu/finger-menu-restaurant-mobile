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
      <TouchableItem onPress={() => this.props.onTablePressed(item.item.id, item.item.status)}>
        <Badge value={item.item.name} containerStyle={{ padding: 25, margin: 15 }} textStyle={{ color: 'orange' }} component={TouchableNative} />
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
          numColumns={4}
          renderItem={this.renderItem}
        />
      </View>
    );
  };
}

TablesView.propTypes = {
  menuItems: TablesProp,
  onTablePressed: PropTypes.func.isRequired,
};

export default TablesView;
