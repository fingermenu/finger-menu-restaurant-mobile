// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { MenuItemProp } from './PropTypes';
import MenuItemView from './MenuItemView';

class MenuItemContainer extends Component<any, Props, State> {
  render = () => {
    return <MenuItemView menuItem={this.props.menuItem} />;
  };
}

MenuItemContainer.propTypes = {
  menuItem: MenuItemProp,
};

function mapStateToProps() {
  const mockOrderOptions = [
    {
      id: 'opt-1',
      name: 'chips',
      priceToDisplay: '$1',
      type: 'Extra',
    },
    {
      id: 'opt-2',
      name: 'Salad',
      priceToDisplay: '$3',
      type: 'Extra',
    },
    {
      id: 'opt-3',
      name: 'Medium',
      priceToDisplay: '',
      type: 'Spicy',
    },
    {
      id: 'opt-4',
      name: 'Hot',
      priceToDisplay: '',
      type: 'Spicy',
    },
  ];
  const mockMenuItem = {
    id: 1,
    name: 'Fish & Chips',
    description: 'The most delicious food in the world. Fresh chips and fish of the day.',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Fitems2.jpg?alt=media&token=40d58c0b-b3fe-4664-81e8-1b285228bde3',
    priceToDisplay: '$5.50',
    orderOptions: mockOrderOptions,
  };

  return {
    menuItem: mockMenuItem,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuItemContainer);
