// @flow

import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { TouchableIcon } from '../../../components/touchableIcon';
import Styles from './Styles';

class ShoppingListHeaderContainer extends Component {
  onViewShoppingListsPressed = () => {
    this.props.gotoShoppingLists();
  };

  render = () => {
    return (
      <View style={Styles.headerContainer}>
        <TouchableIcon iconName="view-list" iconType="material-community" onPress={this.onViewShoppingListsPressed} />
      </View>
    );
  };
}

ShoppingListHeaderContainer.propTypes = {
  gotoShoppingLists: PropTypes.func.isRequired,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    gotoShoppingLists: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'ShoppingLists',
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingListHeaderContainer);
