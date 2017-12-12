// @flow

import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Styles from './Styles';

const HeaderTitleContainer = ({ shoppingListName, totalItemsCount, totalItemsCountExists }) => (
  <View style={Styles.headerTitleContainer}>
    <Text style={Styles.headerTitleText}>{shoppingListName}</Text>
    <Text style={Styles.headerTitleNumberText}>{totalItemsCountExists ? totalItemsCount + ' items' : ''}</Text>
  </View>
);

HeaderTitleContainer.propTypes = {
  shoppingListName: PropTypes.string.isRequired,
  totalItemsCount: PropTypes.number.isRequired,
  totalItemsCountExists: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  const totalItemsCount = state.localState.getIn(['defaultShoppingList', 'totalItemsCount']);

  return {
    shoppingListName: state.localState.getIn(['defaultShoppingList', 'name']),
    totalItemsCount: totalItemsCount.isSome() ? totalItemsCount.some() : 0,
    totalItemsCountExists: totalItemsCount.isSome(),
  };
}

export default connect(mapStateToProps)(HeaderTitleContainer);
