// @flow

import { TouchableItem } from '@microbusiness/common-react-native';
import Immutable from 'immutable';
import React, { Component } from 'react';
import debounce from 'lodash.debounce';
import { View, Image, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { MenuItemProp } from './PropTypes';
import config from '../../framework/config';
import Styles from './Styles';
import { QuantityControlContainer } from '../../components/quantityControl';
import { DefaultColor } from '../../style';

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

  onQuantityIncrease = () => {
    this.props.onAddMenuItemToOrder(this.props.menuItem.id);
  };

  onQuantityDecrease = () => {
    this.props.onRemoveMenuItemFromOrder(this.props.menuItem.id);
  };

  render = () => {
    return (
      <TouchableItem onPress={() => this.props.onViewMenuItemPressed(this.props.menuItem)}>
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
          <View>
            <Icon
              name="dot-single"
              type="entypo"
              color={this.props.orderQuantity > 0 ? DefaultColor.actionButtonColor : DefaultColor.defaultBackgroundColor}
            />
          </View>
          <View>
            <QuantityControlContainer
              quantity={this.props.orderQuantity}
              onQuantityIncrease={this.onQuantityIncrease}
              onQuantityDecrease={this.onQuantityDecrease}
            />
          </View>
        </View>
      </TouchableItem>
    );
  };
}

MenuItemRow.propTypes = {
  menuItem: MenuItemProp,
  orderQuantity: PropTypes.number.isRequired,
  onViewMenuItemPressed: PropTypes.func.isRequired,
  onAddMenuItemToOrder: PropTypes.func.isRequired,
  onRemoveMenuItemFromOrder: PropTypes.func.isRequired,
};

export default MenuItemRow;
