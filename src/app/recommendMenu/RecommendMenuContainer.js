// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import RecommendMenuView from './RecommendMenuView';
import { MenuItemsProp } from '../menu/PropTypes';

class RecommendMenuContainer extends Component {
  state = {
    isFetchingTop: false,
  };

  onRefresh = () => {
    // if (this.props.relay.isLoading()) {
    //   return;
    // }
    //
    // this.setState({
    //   isFetchingTop: true,
    // });
    //
    // this.props.relay.refetchConnection(this.props.user.products.edges.length, () => {
    //   this.setState({
    //     isFetchingTop: false,
    //   });
    // });
  };

  onEndReached = () => {
    // if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
    //   return;
    // }
    //
    // this.props.relay.loadMore(30, () => {});
  };

  onViewMenuItemPressed = menuItemId => {
    this.props.navigateToMenuItem(menuItemId);
  };

  render = () => {
    return (
      <RecommendMenuView
        recommendMenuItems={this.props.recommendMenuItems}
        onViewMenuItemPressed={this.onViewMenuItemPressed}
        onRefresh={this.onRefresh}
        onEndReached={this.onEndReached}
        isFetchingTop={this.state.isFetchingTop}
      />
    );
  };
}

RecommendMenuContainer.propTypes = {
  menuItems: MenuItemsProp,
};

function mapStateToProps() {
  const mockMenuItems = [
    {
      id: 1,
      name: 'Fish & Chips',
      description: 'The most delicious food in the world. Fresh chips and fish of the day.',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Fitems2.jpg?alt=media&token=40d58c0b-b3fe-4664-81e8-1b285228bde3',
      priceToDisplay: '$5.50',
    },
    {
      id: 2,
      name: 'Salad',
      description: 'Fresh vegs and blue cheese.',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Fitems3.jpg?alt=media&token=16b78c22-4359-4e50-a2a5-62c34894d04e',
      priceToDisplay: '$7.50',
    },
    {
      id: 3,
      name: 'Chicken',
      description: 'Grilled crispy chicken',
      imageUrl:
        'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Fitems4.jpg?alt=media&token=8fdb994f-4e93-4661-a6fd-e50e110f2a25',
      priceToDisplay: '$12.90',
    },
  ];

  return {
    recommendMenuItems: mockMenuItems,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navigateToMenuItem: () =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'MenuItem',
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecommendMenuContainer);
