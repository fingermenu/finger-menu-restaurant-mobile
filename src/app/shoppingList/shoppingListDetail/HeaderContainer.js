// @flow

import React, { Component } from 'react';
import { View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { TouchableIcon } from '../../../components/touchableIcon';
import { AddShoppingList, UpdateShoppingList } from '../../../framework/relay/mutations';
import { environment } from '../../../framework/relay';
import * as ShoppingListDetailActions from './Actions';

class HeaderContainer extends Component {
  saveShoppingListDetail = () => {
    if (this.props.shoppingListId) {
      UpdateShoppingList.commit(environment, this.props.userId, this.props.shoppingListId, this.props.shoppingListName);
    } else {
      AddShoppingList.commit(environment, this.props.userId, this.props.shoppingListName);
    }

    this.props.goBack();
    this.props.ShoppingListDetailActions.shoppingListNameChanged(
      Map({
        shoppingListName: '',
      }),
    );
  };

  render = () => {
    const isDisabled = this.props.shoppingListName.trim() ? (this.props.shoppingListName.length > 20 ? true : false) : true;

    return (
      <View>
        <TouchableIcon disabled={isDisabled} iconName="md-checkmark" iconType="ionicon" onPress={this.saveShoppingListDetail} />
      </View>
    );
  };
}

function mapStateToProps(state) {
  return {
    shoppingListName: state.shoppingListDetail.get('shoppingListName'),
    shoppingListId: state.shoppingListDetail.get('shoppingListId'),
    userId: state.userAccess.get('userInfo').get('id'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goBack: () => dispatch(NavigationActions.back()),
    ShoppingListDetailActions: bindActionCreators(ShoppingListDetailActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
