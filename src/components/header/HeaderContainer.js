// @flow

import React, { Component } from 'react';
import HeaderView from './HeaderView';
import { translate } from 'react-i18next';

class HeaderContainer extends Component {
  changeLanguage = () => {
    this.props.i18n.changeLanguage('zh');
  };

  render = () => {
    return <HeaderView changeLanguage={this.changeLanguage} />;
  };
}

export default translate()(HeaderContainer);
