// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable, { Map } from 'immutable';
import * as productsFilterActions from '../productsFilter/Actions';
import Stores from './Stores';
import { StoreItemsProp } from './PropTypes';
import { type StoresFilterRelayContainer_viewer } from './__generated__/StoresFilterRelayContainer_viewer.graphql';

type Props = {
  viewer: StoresFilterRelayContainer_viewer,
};

type State = {
  isFetchingTop: boolean,
};

class StoresFilterContainer extends Component<any, Props, State> {
  state = {
    isFetchingTop: false,
  };

  onStoreSelectionChanged = (id, key, name, isSelected) => {
    const selectedItems = Immutable.fromJS(this.props.selectedStores);

    // original state is selected, so remove from selected list
    if (isSelected) {
      this.props.productsFilterActions.storesFilterOptionChanged(
        Map({
          stores: selectedItems.filterNot(_ => _.get('id') === id),
        }),
      );
    } else {
      this.props.productsFilterActions.storesFilterOptionChanged(
        Map({
          stores: selectedItems.push(
            Map({
              id,
              name,
              key,
            }),
          ),
        }),
      );
    }
  };

  onRefresh = () => {
    if (this.props.relay.isLoading()) {
      return;
    }

    this.setState({
      isFetchingTop: true,
    });

    this.props.relay.refetchConnection(this.props.viewer.stores.edges.length, () => {
      this.setState({
        isFetchingTop: false,
      });
    });
  };

  onEndReached = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
      return;
    }

    this.props.relay.loadMore(30, () => {});
  };

  render = () => {
    return (
      <Stores
        stores={this.props.viewer.stores.edges.map(_ => _.node)}
        selectedStores={this.props.selectedStores}
        onStoreSelectionChanged={this.onStoreSelectionChanged}
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.onRefresh}
        onEndReached={this.onEndReached}
      />
    );
  };
}

StoresFilterContainer.propTypes = {
  selectedStores: StoreItemsProp,
  productsFilterActions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    selectedStores: state.productsFilter.get('stores').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    productsFilterActions: bindActionCreators(productsFilterActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StoresFilterContainer);
