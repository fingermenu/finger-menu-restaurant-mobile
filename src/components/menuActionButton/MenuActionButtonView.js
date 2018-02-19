// @flow

import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from 'react-native-action-button';
import { Icon } from 'react-native-elements';
import Styles from './Styles';
import { DefaultColor } from '../../style';

const MenuActionButtonView = ({ onMenuActionButtonPressed, menus }) => (
  <ActionButton buttonColor={DefaultColor.actionButtonColor} offsetX={50} offsetY={60}>
    {menus.map(prop => {
      return (
        <ActionButton.Item buttonColor="#9b59b6" title={prop.name} key={prop.id} onPress={() => onMenuActionButtonPressed(prop.id)}>
          <Icon name="ios-restaurant-outline" type="ionicon" style={Styles.actionButtonIcon} />
        </ActionButton.Item>
      );
    })}
  </ActionButton>
);

MenuActionButtonView.propTypes = {
  onMenuActionButtonPressed: PropTypes.func.isRequired,
  menus: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MenuActionButtonView;
