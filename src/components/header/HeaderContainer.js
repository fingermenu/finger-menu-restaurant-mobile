// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import HeaderView from './HeaderView';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import { ActiveCustomerProp } from '../../framework/applicationState';

class HeaderContainer extends Component {
  changeLanguage = language => {
    this.props.i18n.changeLanguage(language);
    this.props.applicationStateActions.selectedLanguageChanged(language);
  };

  changeActiveCustomer = activeCustomerId => {
    this.props.applicationStateActions.activeCustomerIdChanged(activeCustomerId);
  };

  render = () => (
    <HeaderView
      changeLanguage={this.changeLanguage}
      changeActiveCustomer={this.changeActiveCustomer}
      backgroundImageUrl={this.props.backgroundImageUrl}
      customers={this.props.customers}
      activeCustomerId={this.props.activeCustomerId}
    />
  );
}

HeaderContainer.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  backgroundImageUrl: PropTypes.string,
  customers: PropTypes.arrayOf(ActiveCustomerProp).isRequired,
  activeCustomerId: PropTypes.string,
};

HeaderContainer.defaultProps = {
  backgroundImageUrl: null,
  activeCustomerId: null,
};

const mapStateToProps = state => ({
  backgroundImageUrl: state.applicationState.getIn(['activeRestaurant', 'configurations', 'images', 'primaryTopBannerImageUrl']),
  customers: state.applicationState
    .getIn(['activeCustomers', 'customers'])
    .valueSeq()
    .toJS(),
  activeCustomerId: state.applicationState.getIn(['activeCustomers', 'activeCustomerId']),
});

const mapDispatchToProps = dispatch => ({
  applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(HeaderContainer));
