// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import FlyerListItem from './FlyerListItem';

class Flyers extends React.PureComponent {
  renderItem = ({ item }) => {
    return (
      <FlyerListItem
        id={item.id}
        name={item.storeDisplayName}
        expiryDate={item.expiryDate}
        thumbnailImageUrl={item.thumbnailImageUrl}
        onFlyerListItemPress={this.props.onFlyerListItemPress}
      />
    );
  };

  render = () => {
    return <FlatList data={this.props.flyers} renderItem={this.renderItem} keyExtractor={item => item.id} />;
  };
}

Flyers.PropTypes = {
  onFlyerListItemPress: PropTypes.func.isRequired,
  flyers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
      thumbnailImageUrl: PropTypes.string,
      expiryDate: PropTypes.string,
    }),
  ).isRequired,
};

export default Flyers;
