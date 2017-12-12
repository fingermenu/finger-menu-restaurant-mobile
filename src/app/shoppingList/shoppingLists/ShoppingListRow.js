// @flow

import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { ListItem, Icon } from 'react-native-elements';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import Styles, { optionsStyles } from './Styles';
import { Color } from '../../../framework/style/DefaultStyles';
import { ShoppingListProp } from './PropTypes';

class ShoppingListRow extends React.PureComponent {
  renderMenu = () => {
    return (
      <Menu>
        <MenuTrigger>
          <Icon name="dots-vertical" type="material-community" />
        </MenuTrigger>
        <MenuOptions customStyles={optionsStyles}>
          <MenuOption onSelect={() => this.props.onEditShoppingListPressed(this.props.shoppingList.id, this.props.shoppingList.name)}>
            <View style={Styles.menuOption}>
              <Icon name="pencil" type="material-community" />
              <Text style={Styles.optionText}>Edit</Text>
            </View>
          </MenuOption>
          <MenuOption onSelect={() => this.props.onDeleteShoppingListPressed(this.props.shoppingList.id, this.props.shoppingList.name)}>
            <View style={Styles.menuOption}>
              <Icon name="delete" type="material-community" />
              <Text style={Styles.optionText}>Delete</Text>
            </View>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  };

  render = () => {
    return (
      <View>
        <ListItem
          key={this.props.shoppingList.id}
          title={this.props.shoppingList.name}
          titleStyle={Styles.shoppingListRowName}
          onPress={() => this.props.onShoppingListPressed(this.props.shoppingList)}
          badge={{
            value: this.props.shoppingList.totalItemsCount,
            textStyle: { color: 'white' },
            containerStyle: { backgroundColor: Color.secondaryColorAction },
          }}
          wrapperStyle={Styles.shoppingListRowContainer}
          leftIcon={{ name: 'list', type: 'font-awesome' }}
          rightIcon={this.renderMenu()}
          containerStyle={Styles.shoppingListRow}
        />
      </View>
    );
  };
}

ShoppingListRow.propTypes = {
  shoppingList: ShoppingListProp,
  onShoppingListPressed: PropTypes.func.isRequired,
  onEditShoppingListPressed: PropTypes.func.isRequired,
  onDeleteShoppingListPressed: PropTypes.func.isRequired,
};

export default ShoppingListRow;
