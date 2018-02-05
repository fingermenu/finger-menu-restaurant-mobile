// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import MenuItemView from './MenuItemView';

class MenuItemContainer extends Component<any, Props, State> {
  render = () => {
    return <MenuItemView menuItemPrice={this.props.user.menuItemPrice} order={this.props.order} />;
  };
}

MenuItemContainer.propTypes = {
  // menuItem: MenuItemProp,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(MenuItemContainer);
