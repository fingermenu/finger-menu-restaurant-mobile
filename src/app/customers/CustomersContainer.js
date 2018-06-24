// @flow

import Immutable, { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import CustomersView from './CustomersView';
import { DefaultColor } from '../../style';
import { CustomersProp } from '../../framework/applicationState';
import Environment from '../../framework/relay/Environment';
import { UpdateTable } from '../../framework/relay/mutations';

class CustomersContainer extends Component {
  static navigationOptions = {
    headerTitle: 'Customers',
    headerStyle: {
      backgroundColor: DefaultColor.defaultBannerColor,
    },
    headerTintColor: DefaultColor.defaultTopHeaderFontColor,
  };

  handleSubmit = values => {
    const { customers: customersWithoutNameSet, activeCustomerId, applicationStateActions, goBack } = this.props;
    const customers = Immutable.fromJS(customersWithoutNameSet).map(customer => customer.set('name', values[customer.get('customerId')]));

    this.updateTable(customers.toJS(), {
      onSuccess: () => {
        applicationStateActions.setActiveCustomers(
          Map({
            customers,
            activeCustomerId,
          }),
        );
        goBack();
      },
    });
  };

  updateTable = (customers, callbacks) => {
    const { tableId: id } = this.props;

    UpdateTable(
      Environment,
      {
        id,
        customers: customers,
      },
      {},
      {},
      callbacks,
    );
  };

  render = () => {
    const { customers } = this.props;

    return <CustomersView customers={customers} onSubmit={this.handleSubmit} />;
  };
}

CustomersContainer.propTypes = {
  customers: CustomersProp.isRequired,
  tableId: PropTypes.string.isRequired,
  activeCustomerId: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  return {
    customers: state.applicationState
      .getIn(['activeCustomers', 'customers'])
      .valueSeq()
      .toJS(),
    activeCustomerId: state.applicationState.getIn(['activeCustomers', 'activeCustomerId']),
    tableId: state.applicationState.getIn(['activeTable', 'id']),
  };
};

const mapDispatchToProps = dispatch => ({
  applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
  goBack: () => dispatch(NavigationActions.back()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomersContainer);
