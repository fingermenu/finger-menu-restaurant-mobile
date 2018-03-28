// @flow

import * as asyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import React, { Component } from 'react';
import Immutable, { Map } from 'immutable';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import int from 'int';
import TablesView from './TablesView';
import * as applicationStateActions from '../../framework/applicationState/Actions';

class TablesContainer extends Component {
  state = {
    isFetchingTop: false,
  };

  componentDidMount = () => {
    const { user: { restaurant: { id, pin, configurations } } } = this.props;

    this.props.asyncStorageActions.writeValue(Map({ key: 'restaurantId', value: id }));
    this.props.asyncStorageActions.writeValue(Map({ key: 'pin', value: pin }));
    this.props.asyncStorageActions.writeValue(Map({ key: 'restaurantConfigurations', value: JSON.stringify(configurations) }));
    this.props.applicationStateActions.setActiveRestaurant(Map({ id, pin, configurations: Immutable.fromJS(configurations) }));
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.selectedLanguage.localeCompare(this.props.selectedLanguage) !== 0) {
      this.handleRefresh();
    }
  };

  onTablePressed = table => {
    if (!table.tableState || table.tableState.key === 'empty' || table.tableState.key === 'reserved') {
      if (table.tableState.key === 'reserved') {
        this.setActiveCustomer(table);
      } else {
        this.props.applicationStateActions.clearActiveCustomer();
      }

      this.props.applicationStateActions.setActiveTable(Immutable.fromJS(table));
      this.props.navigateToTableSetup();
    } else if (table.tableState.key === 'taken' || table.tableState.key === 'paid') {
      this.setActiveCustomer(table);
      this.props.applicationStateActions.setActiveTable(Immutable.fromJS(table));
      this.props.navigateToTableDetail(table);
    }
  };

  setActiveCustomer = table => {
    this.props.applicationStateActions.setActiveCustomer(
      Map({
        name: table.customerName,
        reservationNotes: table.notes,
        numberOfAdults: table.numberOfAdults,
        numberOfChildren: table.numberOfChildren,
      }),
    );
  };

  handleRefresh = () => {
    if (this.props.relay.isLoading()) {
      return;
    }

    this.setState({ isFetchingTop: true });

    this.props.relay.refetchConnection(this.props.user.tables.edges.length, () => {
      this.setState({ isFetchingTop: false });
    });
  };

  handleEndReached = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }

    this.props.relay.loadMore(30, () => {});
  };

  render = () => {
    return (
      <TablesView
        tables={this.props.user.tables.edges.map(_ => _.node).sort((node1, node2) => int(node1.sortOrderIndex).cmp(node2.sortOrderIndex))}
        onTablePressed={this.onTablePressed}
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleEndReached}
      />
    );
  };
}

TablesContainer.propTypes = {
  asyncStorageActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  navigateToTableSetup: PropTypes.func.isRequired,
  navigateToTableDetail: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    selectedLanguage: state.applicationState.get('selectedLanguage'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    asyncStorageActions: bindActionCreators(asyncStorageActions, dispatch),
    applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
    navigateToTableSetup: () => dispatch(NavigationActions.navigate({ routeName: 'TableSetup' })),
    navigateToTableDetail: () => dispatch(NavigationActions.navigate({ routeName: 'TableDetail' })),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TablesContainer);
