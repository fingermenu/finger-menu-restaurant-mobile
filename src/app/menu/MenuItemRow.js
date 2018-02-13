// @flow

import { TouchableItem } from '@microbusiness/common-react-native';
import Immutable from 'immutable';
import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { View, Image, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { MenuItemPriceProp } from './PropTypes';
import config from '../../framework/config';
import Styles from './Styles';
import { DefaultColor, DefaultStyles } from '../../style';

class MenuItemRow extends Component {
  constructor(props, context) {
    super(props, context);

    this.onViewMenuItemPressed = debounce(this.props.onViewMenuItemPressed, config.navigationDelay);

    this.state = { menuItemPrice: Immutable.fromJS(props.menuItemPrice) };
  }

  shouldComponentUpdate = nextProps => {
    return this.state.menuItemPrice.equals(Immutable.fromJS(nextProps.menuItemPrice));
  };

  componentWillReceiveProps = nextProps => {
    const menuItemPrice = Immutable.fromJS(nextProps.menuItemPrice);

    if (!this.state.menuItemPrice.equals(menuItemPrice)) {
      this.setState({ menuItemPrice });
    }
  };

  render = () => {
    return (
      <TouchableItem onPress={this.onViewMenuItemPressed}>
        <View style={Styles.rowContainer}>
          <View style={Styles.rowImageContainer}>
            {this.props.menuItemPrice.menuItem.imageUrl ? (
              <Image
                style={Styles.image}
                source={{
                  uri: this.props.menuItemPrice.menuItem.imageUrl,
                }}
              />
            ) : (
              <View />
            )}
          </View>
          <View style={Styles.rowTextContainer}>
            <Text style={DefaultStyles.primaryTitleFont}>{this.props.menuItemPrice.menuItem.name}</Text>
            <Text style={DefaultStyles.primaryLabelFont}>{this.props.menuItemPrice.menuItem.description}</Text>
            <Text style={DefaultStyles.primaryFont}>${this.props.menuItemPrice.currentPrice}</Text>
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

  onViewMenuItemPressed = () => this.props.onViewMenuItemPressed(this.props.menuItemPrice.id);
}

MenuItemRow.propTypes = {
  menuItemPrice: MenuItemPriceProp.isRequired,
  isOrdered: PropTypes.bool.isRequired,
  onViewMenuItemPressed: PropTypes.func.isRequired,
};

export default MenuItemRow;
