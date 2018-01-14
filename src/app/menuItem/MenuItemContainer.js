// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MenuItemProp } from './PropTypes';
import MenuItemView from './MenuItemView';

class MenuItemContainer extends Component<any, Props, State> {
  render = () => {
    return <MenuItemView menuItem={this.props.menuItem} order={this.props.order} />;
  };
}

MenuItemContainer.propTypes = {
  menuItem: MenuItemProp,
};

function mapStateToProps(state, props) {
  return {
    menuItem: props.navigation.state.params && props.navigation.state.params.menuItem ? props.navigation.state.params.menuItem : null,
    order: props.navigation.state.params && props.navigation.state.params.order ? props.navigation.state.params.order : null,
    orders: state.orders.get('orders').toJS(),
  };
}

export default connect(mapStateToProps)(MenuItemContainer);
