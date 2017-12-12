// @flow

import React, { Component } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import UserFeedback from './UserFeedback';
import MainMenuContainer from '../../sharedComponents/mainMenu/MainMenuContainer';
import { Color } from '../../framework/style/DefaultStyles';
import { SubmitUserFeedback } from '../../framework/relay/mutations';
import { environment } from '../../framework/relay';
import * as userFeedbackActions from './Actions';

class UserFeedbackContainer extends Component {
  static navigationOptions = {
    headerLeft: <MainMenuContainer />,
    headerTitle: 'Give Feedback',
    headerTintColor: Color.headerIconDefaultColor,
    headerStyle: {
      backgroundColor: Color.secondaryColorAction,
    },
  };

  componentWillMount = () => {
    this.props.userFeedbackActions.userFeedbackOptionsChanged(Map({ options: Map(), message: '' }));
  };

  onMessageChanged = message => {
    this.props.userFeedbackActions.userFeedbackMessageChanged(Map({ message }));
  };

  onOptionsChanged = (optionKey, optionText, isSelected) => {
    let selectedOptions = this.props.options;

    if (isSelected) {
      selectedOptions = selectedOptions.delete(optionKey);
    } else {
      selectedOptions = selectedOptions.set(optionKey, optionText);
    }

    this.props.userFeedbackActions.userFeedbackOptionsChanged(Map({ options: selectedOptions }));
  };

  onSendPress = () => {
    SubmitUserFeedback.commit(
      environment,
      Map({
        message: this.props.message,
        options: this.props.options,
      }),
    );
    this.props.goBack();
  };

  render = () => {
    return (
      <UserFeedback
        onSendPress={this.onSendPress}
        onMessageChanged={this.onMessageChanged}
        onOptionsChanged={this.onOptionsChanged}
        selectedOptions={this.props.options}
      />
    );
  };
}

UserFeedbackContainer.propTypes = {};

function mapStateToProps(state) {
  return {
    userId: state.userAccess.getIn(['userInfo', 'id']),
    message: state.userFeedback.get('message'),
    options: state.userFeedback.get('options'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userFeedbackActions: bindActionCreators(userFeedbackActions, dispatch),
    goBack: () => dispatch(NavigationActions.back()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserFeedbackContainer);
