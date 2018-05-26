// @flow

import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import HeaderView from './HeaderView';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import { CustomerProp } from '../../framework/applicationState';

class HeaderContainer extends Component {
  handleLanguageChanged = language => {
    this.props.i18n.changeLanguage(language);
    this.props.applicationStateActions.selectedLanguageChanged(language);
  };

  handleActiveCustomerChanged = customerId => {
    this.props.applicationStateActions.activeCustomerChanged(Map({ customerId }));
  };

  handleEditCustomerNamePressed = () => {
    this.props.navigateToCustomers();
  };

  render = () => (
    <HeaderView
      onLanguageChanged={this.handleLanguageChanged}
      onActiveCustomerChanged={this.handleActiveCustomerChanged}
      backgroundImageUrl={this.props.backgroundImageUrl}
      customers={this.props.customers}
      activeCustomerId={this.props.activeCustomerId}
      onEditCustomerNamePressed={this.handleEditCustomerNamePressed}
    />
  );
}

HeaderContainer.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  backgroundImageUrl: PropTypes.string,
  customers: PropTypes.arrayOf(CustomerProp).isRequired,
  activeCustomerId: PropTypes.string,
  navigateToCustomers: PropTypes.func.isRequired,
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
  navigateToCustomers: () => dispatch(NavigationActions.navigate({ routeName: 'Customers' })),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(HeaderContainer));
