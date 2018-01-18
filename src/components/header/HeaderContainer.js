// @flow

import React, { Component } from 'react';
import HeaderView from './HeaderView';
import { translate } from 'react-i18next';

class HeaderContainer extends Component {
  changeLanguage = lang => {
    this.props.i18n.changeLanguage(lang);
  };

  render = () => {
    return <HeaderView changeLanguage={this.changeLanguage} />;
  };
}

export default translate()(HeaderContainer);
