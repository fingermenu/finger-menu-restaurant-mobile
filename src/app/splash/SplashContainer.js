// @flow

import * as userAccessActions from '@microbusiness/common-react/src/userAccess/Actions';
import { LoadingInProgress } from '@microbusiness/common-react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class SplashContainer extends Component {
  componentWillMount = () => {
    this.props.userAccessActions.getCurrentUser();
  };

  render = () => <LoadingInProgress />;
}

SplashContainer.propTypes = {
  userAccessActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  getCurrentUserStatus: PropTypes.number.isRequired,
};

function mapStateToProps(state) {
  return {
    getCurrentUserStatus: state.userAccess.get('getCurrentUserStatus'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userAccessActions: bindActionCreators(userAccessActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashContainer);
