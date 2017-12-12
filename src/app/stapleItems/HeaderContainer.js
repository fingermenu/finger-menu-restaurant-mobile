// @flow

import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { View } from 'react-native';
import { connect } from 'react-redux';
import * as StapleItemsActions from './Actions';
import { SearchBarWithDelay } from '../../sharedComponents/searchBarWithDelay';
import Styles from './Styles';

class HeaderContainer extends Component {
  onSearchKeywordChanged = searchKeyword => {
    this.props.stapleItemsActions.searchKeywordChanged(Map({ searchKeyword }));
  };

  render = () => {
    return (
      <View style={Styles.searchHeader}>
        <SearchBarWithDelay searchKeyword={this.props.searchKeyword} onSearchKeywordChanged={this.onSearchKeywordChanged} autoFocus={false} />
      </View>
    );
  };
}

HeaderContainer.propTypes = {
  searchKeyword: PropTypes.string,
  stapleItemsActions: PropTypes.object.isRequired,
};

HeaderContainer.defaultProps = {
  searchKeyword: '',
};

function mapStateToProps(state) {
  return {
    searchKeyword: state.stapleItems.get('searchKeyword'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    stapleItemsActions: bindActionCreators(StapleItemsActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
