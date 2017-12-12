// @flow

import * as userAccessActions from 'micro-business-parse-server-common-react-native/src/userAccess/Actions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { LoadingInProgress } from '../../sharedComponents/loadingInProgress';

class SplashContainer extends Component {
  componentWillMount = () => {
    this.props.userAccessActions.getCurrentUser();
  };

  render = () => <LoadingInProgress />;
}

SplashContainer.propTypes = {
  userAccessActions: PropTypes.object.isRequired,
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
