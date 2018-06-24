// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import { MenuOption } from 'react-native-popup-menu';
import Styles from './Styles';
import { DefaultColor } from '../../style';

class ActiveCustomersMenuOption extends Component {
  handleActiveCustomerChanged = () => {
    const { onActiveCustomerChanged, customerId } = this.props;

    onActiveCustomerChanged(customerId);
  };

  render = () => {
    const { isSelected, name } = this.props;

    return (
      <MenuOption onSelect={this.handleActiveCustomerChanged}>
        <View style={[Styles.menuOptionContainer, isSelected ? Styles.selectedIconContainer : Styles.iconContainer]}>
          <Avatar
            rounded
            icon={{ name: 'person', color: isSelected ? 'white' : DefaultColor.iconColor }}
            overlayContainerStyle={isSelected ? Styles.selectedIconContainer : Styles.iconContainer}
            activeOpacity={0.7}
          />
          <View style={Styles.iconTextContainer}>
            <Text style={isSelected ? Styles.selectedIconText : Styles.IconText}>
              {name}
            </Text>
          </View>
        </View>
      </MenuOption>
    );
  };
}

ActiveCustomersMenuOption.propTypes = {
  customerId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onActiveCustomerChanged: PropTypes.func.isRequired,
};

export default ActiveCustomersMenuOption;
