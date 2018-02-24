// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HeaderView from './HeaderView';
import * as localStateActions from '../../framework/localState/Actions';

class HeaderContainer extends Component {
  changeLanguage = language => {
    this.props.i18n.changeLanguage(language);
    this.props.localStateActions.selectedLanguageChanged(language);
  };

  render = () => {
    return (
      <HeaderView changeLanguage={this.changeLanguage} backgroundImageUrl={this.props.restaurantConfigurations.images.primaryTopBannerImageUrl} />
    );
  };
}

HeaderContainer.propTypes = {
  localStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

function mapStateToProps(state) {
  return {
    restaurantConfigurations: JSON.parse(state.asyncStorage.getIn(['keyValues', 'restaurantConfigurations'])),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    localStateActions: bindActionCreators(localStateActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(HeaderContainer));
