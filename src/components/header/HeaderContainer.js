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

  render = () => <HeaderView changeLanguage={this.changeLanguage} backgroundImageUrl={this.props.backgroundImageUrl} />;
}

HeaderContainer.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  backgroundImageUrl: PropTypes.string,
};

HeaderContainer.defaultProps = {
  backgroundImageUrl: null,
};

const mapStateToProps = state => ({
  backgroundImageUrl: state.applicationState.getIn(['activeRestaurant', 'configurations', 'images', 'primaryTopBannerImageUrl']),
});

const mapDispatchToProps = dispatch => ({
  applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(HeaderContainer));
