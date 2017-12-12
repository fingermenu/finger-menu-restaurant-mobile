// @flow

import React, { Component } from 'react';
import { View } from 'react-native';
import { Text, Avatar } from 'react-native-elements';
import PropTypes from 'prop-types';
import Styles from './Styles';
import { TouchableItem } from '../../components/touchableIcon';
import { Color } from '../../framework/style/DefaultStyles';
import { ImageUltility } from '../../components/image';
import { StapleItemProp } from './PropTypes';

class StapleItem extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { isSelected: props.isSelected };
  }

  shouldComponentUpdate = nextProps => {
    return this.state.isSelected !== nextProps.isSelected;
  };

  componentWillReceiveProps = nextProps => {
    if (this.state.isSelected !== nextProps.isSelected) {
      this.setState({ isSelected: nextProps.isSelected });
    }
  };

  onItemPressed = () => {
    this.props.onStapleItemSelectionChanged(this.props.stapleItem, this.props.isSelected);
  };

  render() {
    return (
      <TouchableItem
        accessibilityComponentType="button"
        accessibilityTraits="button"
        delayPressIn={0}
        pressColor={Color.touchableIconPressColor}
        onPress={this.onItemPressed}
        borderless
      >
        <View style={Styles.touchableContainer}>
          <Avatar
            rounded
            overlayContainerStyle={this.props.isSelected ? Styles.itemIconSelectedContainer : Styles.itemIconContainer}
            source={ImageUltility.getImageSource(this.props.stapleItem.name.toLowerCase().replace(/\s+/g, ''))}
            activeOpacity={0.7}
          />
          <Text style={this.props.isSelected ? Styles.itemNameSelected : Styles.itemName}>{this.props.stapleItem.name}</Text>
        </View>
      </TouchableItem>
    );
  }
}

StapleItem.propTypes = {
  stapleItem: StapleItemProp,
  isSelected: PropTypes.bool,
};

StapleItem.defaultProps = {
  isCustomItem: false,
};

export default StapleItem;
