// @flow

import * as asyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import React, { Component } from 'react';
import { Map } from 'immutable';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import int from 'int';
import TablesView from './TablesView';

class TablesContainer extends Component {
  state = {
    isFetchingTop: false,
  };

  componentWillMount = () => {
    const { user: { restaurant: { id, name, pin, configurations } } } = this.props;

    this.props.asyncStorageActions.writeValue(Map({ key: 'restaurantId', value: id }));
    this.props.asyncStorageActions.writeValue(Map({ key: 'pin', value: pin }));
    this.props.asyncStorageActions.writeValue(Map({ key: 'restaurantName', value: name }));
    this.props.asyncStorageActions.writeValue(Map({ key: 'restaurantConfigurations', value: JSON.stringify(configurations) }));
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.selectedLanguage.localeCompare(this.props.selectedLanguage) !== 0) {
      this.handleRefresh();
    }
  };

  onTablePressed = table => {
    if (!table.tableState || table.tableState.key === 'empty' || table.tableState.key === 'reserved') {
      this.props.navigateToTableSetup(table);
    } else if (table.tableState.key === 'taken' || table.tableState.key === 'paid') {
      this.props.navigateToTableDetail(table);
    }
  };

  handleRefresh = () => {
    if (this.props.relay.isLoading()) {
      return;
    }

    this.setState({
      isFetchingTop: true,
    });

    this.props.relay.refetchConnection(this.props.user.tables.edges.length, () => {
      this.setState({
        isFetchingTop: false,
      });
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
  navigateToTableSetup: PropTypes.func.isRequired,
  navigateToTableDetail: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    selectedLanguage: state.localState.get('selectedLanguage'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    asyncStorageActions: bindActionCreators(asyncStorageActions, dispatch),
    navigateToTableSetup: table =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'TableSetup',
          params: {
            table,
          },
        }),
      ),
    navigateToTableDetail: table =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'TableDetail',
          params: {
            table,
          },
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TablesContainer);
