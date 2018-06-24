// @flow

import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DrawerActions, NavigationActions } from 'react-navigation';
import HeaderView from './HeaderView';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import { CustomerProp } from '../../framework/applicationState';

class HeaderContainer extends Component {
  handleLanguageChanged = language => {
    const { i18n, applicationStateActions } = this.props;

    i18n.changeLanguage(language);
    applicationStateActions.selectedLanguageChanged(language);
  };

  handleActiveCustomerChanged = customerId => {
    const { applicationStateActions } = this.props;

    applicationStateActions.activeCustomerChanged(Map({ customerId }));
  };

  handleEditCustomerNamePressed = () => {
    const { navigateToCustomers } = this.props;

    navigateToCustomers();
  };

  render = () => {
    const { restaurantName, customers, activeCustomerId, showOpenDrawerIcon, openDrawer } = this.props;

    return (
      <HeaderView
        onLanguageChanged={this.handleLanguageChanged}
        onActiveCustomerChanged={this.handleActiveCustomerChanged}
        restaurantName={restaurantName}
        customers={customers}
        activeCustomerId={activeCustomerId}
        onEditCustomerNamePressed={this.handleEditCustomerNamePressed}
        showOpenDrawerIcon={showOpenDrawerIcon}
        onOpenDrawerIconPressed={openDrawer}
      />
    );
  };
}

HeaderContainer.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  customers: PropTypes.arrayOf(CustomerProp).isRequired,
  activeCustomerId: PropTypes.string,
  navigateToCustomers: PropTypes.func.isRequired,
  showOpenDrawerIcon: PropTypes.bool,
  openDrawer: PropTypes.func.isRequired,
  restaurantName: PropTypes.string,
};

HeaderContainer.defaultProps = {
  activeCustomerId: null,
  showOpenDrawerIcon: false,
  restaurantName: '',
};

const mapStateToProps = state => ({
  restaurantName: state.applicationState.getIn(['activeRestaurant', 'name']),
  customers: state.applicationState
    .getIn(['activeCustomers', 'customers'])
    .valueSeq()
    .toJS(),
  activeCustomerId: state.applicationState.getIn(['activeCustomers', 'activeCustomerId']),
});

const mapDispatchToProps = dispatch => ({
  applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
  navigateToCustomers: () => dispatch(NavigationActions.navigate({ routeName: 'Customers' })),
  openDrawer: () => dispatch(DrawerActions.openDrawer()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(HeaderContainer));
