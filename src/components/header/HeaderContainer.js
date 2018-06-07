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
      restaurantName={this.props.restaurantName}
      customers={this.props.customers}
      activeCustomerId={this.props.activeCustomerId}
      onEditCustomerNamePressed={this.handleEditCustomerNamePressed}
      showOpenDrawerIcon={this.props.showOpenDrawerIcon}
      onOpenDrawerIconPressed={this.props.openDrawer}
    />
  );
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
