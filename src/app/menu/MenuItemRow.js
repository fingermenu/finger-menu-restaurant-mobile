// @flow

import { TouchableItem } from '@microbusiness/common-react-native';
import Immutable from 'immutable';
import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { View, Text } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { MenuItemPriceProp } from './PropTypes';
import config from '../../framework/config';
import Styles from './Styles';
import { DefaultColor, DefaultStyles } from '../../style';

class MenuItemRow extends Component {
  constructor(props, context) {
    super(props, context);

    this.onViewMenuItemPressedDebounced = debounce(this.props.onViewMenuItemPressed, config.navigationDelay);

    this.state = { menuItemPrice: Immutable.fromJS(props.menuItemPrice) };
  }

  componentWillReceiveProps = nextProps => {
    const menuItemPrice = Immutable.fromJS(nextProps.menuItemPrice);

    if (!this.state.menuItemPrice.equals(menuItemPrice)) {
      this.setState({ menuItemPrice });
    }
  };

  shouldComponentUpdate = nextProps => {
    return this.state.menuItemPrice.equals(Immutable.fromJS(nextProps.menuItemPrice));
  };

  onViewMenuItemPressed = () => this.onViewMenuItemPressedDebounced(this.props.menuItemPrice.id);

  render = () => {
    const { menuItemPrice: { menuItem: { name, description, currentPrice, imageUrl } } } = this.props;
    return (
      <TouchableItem onPress={this.onViewMenuItemPressed}>
        <View style={Styles.rowContainer}>
          <View style={Styles.rowImageContainer}>{imageUrl ? <FastImage style={Styles.image} source={{ uri: imageUrl }} /> : <View />}</View>
          <View style={Styles.rowTextContainer}>
            <Text style={DefaultStyles.primaryTitleFont}>{name}</Text>
            <Text style={DefaultStyles.primaryLabelFont}>{description}</Text>
            <Text style={DefaultStyles.primaryFont}>${currentPrice}</Text>
          </View>
          <View>
            <Icon
              name="dot-single"
              type="entypo"
              size={36}
              color={this.props.isOrdered > 0 ? DefaultColor.actionButtonColor : DefaultColor.defaultBackgroundColor}
            />
          </View>
        </View>
      </TouchableItem>
    );
  };
}

MenuItemRow.propTypes = {
  menuItemPrice: MenuItemPriceProp.isRequired,
  isOrdered: PropTypes.bool.isRequired,
  onViewMenuItemPressed: PropTypes.func.isRequired,
};

export default MenuItemRow;
