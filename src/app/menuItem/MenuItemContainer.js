// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MenuItemProp } from './PropTypes';
import MenuItemView from './MenuItemView';

class MenuItemContainer extends Component<any, Props, State> {
  render = () => {
    return <MenuItemView menuItemPrice={this.props.user.menuItemPrice} order={this.props.order} />;
  };
}

MenuItemContainer.propTypes = {
  menuItem: MenuItemProp,
};

function mapStateToProps(state) {
  return {
    orders: state.orders.get('orders').toJS(),
  };
}

export default connect(mapStateToProps)(MenuItemContainer);
