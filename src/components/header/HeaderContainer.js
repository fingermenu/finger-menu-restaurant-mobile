// @flow

import React, { Component } from 'react';
import { translate } from 'react-i18next';
import HeaderView from './HeaderView';

class HeaderContainer extends Component {
  changeLanguage = lang => {
    this.props.i18n.changeLanguage(lang);
  };

  render = () => {
    return <HeaderView changeLanguage={this.changeLanguage} />;
  };
}

export default translate()(HeaderContainer);
