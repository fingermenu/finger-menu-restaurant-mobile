// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import HeaderView from './HeaderView';

class HeaderContainer extends Component {
  changeLanguage = () => {
    // this.props.i18n.changeLanguage(lang);
  };

  render = () => {
    return <HeaderView changeLanguage={this.changeLanguage} />;
  };
}

function mapStateToProps(state, props) {
  return {
    i18n: props.i18n,
  };
}

export default connect(mapStateToProps)(HeaderContainer);
