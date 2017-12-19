// @flow

import Immutable from 'immutable';
import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { View, Image, Text } from 'react-native';
import PropTypes from 'prop-types';
import { TouchableItem } from 'micro-business-common-react-native';
import { MenuItemProp } from './PropTypes';
import config from '../../framework/config';
import Styles from './Styles';

class MenuItemRow extends Component {
  constructor(props, context) {
    super(props, context);

    this.onViewMenuItemPressed = debounce(this.props.onViewMenuItemPressed, config.navigationDelay);

    this.state = { menuItem: Immutable.fromJS(props.menuItem) };
  }

  shouldComponentUpdate = nextProps => {
    return this.state.menuItem.equals(Immutable.fromJS(nextProps.menuItem));
  };

  componentWillReceiveProps = nextProps => {
    const menuItem = Immutable.fromJS(nextProps.menuItem);

    if (!this.state.menuItem.equals(menuItem)) {
      this.setState({ menuItem });
    }
  };

  render = () => {
    return (
      <TouchableItem onPress={() => this.props.onViewMenuItemPressed(this.props.menuItem.id)}>
        <View style={Styles.rowContainer}>
          <View style={Styles.rowImageContainer}>
            <Image
              style={Styles.image}
              source={{
                uri: this.props.menuItem.imageUrl,
              }}
            />
          </View>
          <View style={Styles.rowTextContainer}>
            <Text style={Styles.title}>{this.props.menuItem.name}</Text>
            <Text style={Styles.description}>{this.props.menuItem.description}</Text>
            <Text style={Styles.price}>{this.props.menuItem.priceToDisplay}</Text>
          </View>
        </View>
      </TouchableItem>
    );
  };
}

MenuItemRow.propTypes = {
  menuItem: MenuItemProp,
  onViewMenuItemPressed: PropTypes.func.isRequired,
};

export default MenuItemRow;
