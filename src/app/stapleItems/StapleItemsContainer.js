// @flow

import Immutable, { Map, List } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import StapleItemsList from './StapleItemsList';
import * as StapleItemsActions from './Actions';
import { AddItemsToShoppingList } from '../../framework/relay/mutations';
import { type StapleItemsRelayContainer_user } from './__generated__/StapleItemsRelayContainer_user.graphql';

type Props = {
  user: StapleItemsRelayContainer_user,
};

type State = {
  isFetchingTop: boolean,
};

class StapleItemsContrainer extends Component<any, Props, State> {
  state = {
    isFetchingTop: false,
  };

  tryAddStapleItems = () => {
    if (this.props.selectedStapleItems.length !== 0) {
      AddItemsToShoppingList.commit(this.props.relay.environment, this.props.user.id, this.props.shoppingListId, {
        newStapleItemNames: this.props.selectedStapleItems.filter(_ => _.isCustomItem).map(_ => _.name),
        stapleItems: Immutable.fromJS(this.props.selectedStapleItems.filter(_ => !_.isCustomItem)),
      });

      // Clear the selected staple list
      this.props.stapleItemsActions.stapleItemSelectionChanged(Map({ selectedStapleItems: List() }));
    }
  };

  componentWillUnmount = () => {
    this.tryAddStapleItems();
  };

  clearSearchKeyword = () => {
    this.props.stapleItemsActions.searchKeywordChanged(Map({ searchKeyword: '' }));
  };

  onStapleItemSelectionChanged = (stapleItem, isSelected) => {
    const selectedItems = Immutable.fromJS(this.props.selectedStapleItems);

    // original state is selected, so remove from selected list
    if (isSelected) {
      this.props.stapleItemsActions.stapleItemSelectionChanged(
        Map({ selectedStapleItems: selectedItems.filterNot(_ => _.get('id') === stapleItem.id) }),
      );
    } else {
      if (!stapleItem.id) {
        this.clearSearchKeyword();
      }

      this.props.stapleItemsActions.stapleItemSelectionChanged(
        Map({
          selectedStapleItems: selectedItems.push(
            Map({
              id: stapleItem.id || uuid(),
              name: stapleItem.name,
              isCustomItem: stapleItem.isCustomItem,
              tags: Immutable.fromJS(stapleItem.tags),
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

    this.props.relay.refetchConnection(this.props.user.stapleItems.edges.length, () => {
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

  getStapleItemsWithCustomItem = () => {
    const stapleList = this.props.temporaryCustomItems.concat(this.props.user.stapleItems.edges.map(_ => _.node));
    const customStapleItem = this.props.customStapleItem;

    if (customStapleItem) {
      const customItemName = customStapleItem.trim();
      const exactMatchStapleItem = stapleList.find(_ => _.name.toLowerCase() === customItemName.toLowerCase());

      if (!exactMatchStapleItem) {
        return [{ name: customItemName, isCustomItem: true }].concat(stapleList);
      }

      return stapleList;
    }

    return stapleList;
  };

  render = () => {
    return (
      <StapleItemsList
        stapleItems={this.getStapleItemsWithCustomItem()}
        onStapleItemSelectionChanged={this.onStapleItemSelectionChanged}
        selectedStapleItems={this.props.selectedStapleItems}
        isFetchingTop={this.state.isFetchingTop}
        onRefresh={this.onRefresh}
        onEndReached={this.onEndReached}
      />
    );
  };
}

StapleItemsContrainer.propTypes = {
  customStapleItem: PropTypes.string,
  stapleItemsActions: PropTypes.object.isRequired,
  shoppingListId: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return {
    customStapleItem: state.stapleItems.get('searchKeyword'),
    selectedStapleItems: state.stapleItems.get('selectedStapleItems').toJS(),
    temporaryCustomItems: state.stapleItems.get('temporaryCustomItems').toJS(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    stapleItemsActions: bindActionCreators(StapleItemsActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StapleItemsContrainer);
