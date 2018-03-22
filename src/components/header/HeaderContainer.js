// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HeaderView from './HeaderView';
import * as applicationStateActions from '../../framework/applicationState/Actions';

class HeaderContainer extends Component {
  changeLanguage = language => {
    this.props.i18n.changeLanguage(language);
    this.props.applicationStateActions.selectedLanguageChanged(language);
  };

  render = () => {
    return (
      <HeaderView changeLanguage={this.changeLanguage} backgroundImageUrl={this.props.restaurantConfigurations.images.primaryTopBannerImageUrl} />
    );
  };
}

HeaderContainer.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

function mapStateToProps(state) {
  return {
    restaurantConfigurations: JSON.parse(state.asyncStorage.getIn(['keyValues', 'restaurantConfigurations'])),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(HeaderContainer));
