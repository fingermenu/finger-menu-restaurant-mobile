// @flow

import React, { Component } from 'react';
import { translate } from 'react-i18next';
import HeaderView from './HeaderView';

class HeaderContainer extends Component {
  render = () => {
    return <HeaderView changeLanguage={this.changeLanguage} />;
  };

  changeLanguage = language => {
    this.props.i18n.changeLanguage(language);
  };
}

export default translate()(HeaderContainer);
