// @flow

import React, { Component } from 'react';
import { translate } from 'react-i18next';
import HeaderView from './HeaderView';

class HeaderContainer extends Component {
  changeLanguage = language => {
    this.props.i18n.changeLanguage(language);
  };

  render = () => {
    return <HeaderView changeLanguage={this.changeLanguage} />;
  };
}

export default translate()(HeaderContainer);
