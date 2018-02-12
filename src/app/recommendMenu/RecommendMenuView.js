// @flow

import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { MenuItemsProp } from '../menu/PropTypes';
import RecommendMenuItem from './RecommendMenuItem';

class RecommendMenuView extends Component {
  render = () => {
    return (
      <View>
        <Text>Recommend menus</Text>
        <FlatList
          horizontal={true}
          data={this.props.recommendMenuItems}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          onEndReached={this.props.onEndReached}
          onRefresh={this.props.onRefresh}
          refreshing={this.props.isFetchingTop}
        />
      </View>
    );
  };

  keyExtractor = item => item.id;

  renderItem = info => <RecommendMenuItem menuItem={info.item} onViewMenuItemPressed={this.props.onViewMenuItemPressed} />;
}

RecommendMenuView.propTypes = {
  recommendMenuItems: MenuItemsProp,
  onViewMenuItemPressed: PropTypes.func.isRequired,
  isFetchingTop: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onEndReached: PropTypes.func.isRequired,
};

export default RecommendMenuView;
