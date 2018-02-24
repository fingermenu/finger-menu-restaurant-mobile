// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import MenuItemView from './MenuItemView';

class MenuItemContainer extends Component {
  componentWillReceiveProps = nextProps => {
    if (nextProps.selectedLanguage.localeCompare(this.props.selectedLanguage) !== 0) {
      this.props.relay.refetch(_ => ({
        menuItemPriceId: _.menuItemPriceId,
      }));
    }
  };

  render = () => {
    const { user: { menuItemPrice }, order, orderItemId } = this.props;

    return <MenuItemView menuItemPrice={menuItemPrice} order={order} orderItemId={orderItemId} />;
  };
}

MenuItemContainer.propTypes = {
  // TODO: Add menus props
};

function mapStateToProps(state) {
  return {
    selectedLanguage: state.localState.get('selectedLanguage'),
  };
}

export default connect(mapStateToProps)(MenuItemContainer);
