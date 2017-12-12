// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { bindActionCreators } from 'redux';
import { Map, List } from 'immutable';
import { connect } from 'react-redux';
import Styles from './Styles';
import { TouchableItem } from '../../components/touchableIcon';
import * as productsFilterActions from './Actions';

class HeaderContainer extends Component {
  clearFilters = () => {
    this.props.productsFilterActions.sortOptionChanged(
      Map({
        sortOption: '',
      }),
    );
    this.props.productsFilterActions.categoriesFilterOptionChanged(
      Map({
        categories: List(),
      }),
    );
    this.props.productsFilterActions.storesFilterOptionChanged(
      Map({
        stores: List(),
      }),
    );
  };

  render = () => {
    return (
      <View style={Styles.clearFilterHeaderContainer}>
        <TouchableItem onPress={this.clearFilters}>
          <Text style={Styles.clearFilterText}>Clear filters</Text>
        </TouchableItem>
      </View>
    );
  };
}

HeaderContainer.propTypes = {
  productsFilterActions: PropTypes.object.isRequired,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    productsFilterActions: bindActionCreators(productsFilterActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
