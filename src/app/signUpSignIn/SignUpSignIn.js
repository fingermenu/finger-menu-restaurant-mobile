// @flow

import emailValidator from 'email-validator';
import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import { Button, FormLabel, FormInput, FormValidationMessage, Text } from 'react-native-elements';
import Styles from './Styles';
import { Color } from '../../framework/style/DefaultStyles';

class UserSignInSignUpPresentational extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      data: Map({
        signInInputAreaHidden: true,
        signInButtonPressed: false,
        signInEmailAddress: '',
        signInEmailAddressChanged: false,
        signInPassword: '',
        signInPasswordChanged: false,
        signUpInputAreaHidden: true,
        signUpButtonPressed: false,
        signUpEmailAddress: '',
        signUpEmailAddressChanged: false,
        signUpPassword: '',
        signUpPasswordChanged: false,
        signUpConfirmPassword: '',
        signUpConfirmPasswordChanged: false,
      }),
    };
  }

  onSignInEmailAddressChanged = text => {
    this.setState({
      data: this.state.data.set('signInEmailAddress', text.toLowerCase()).set('signInEmailAddressChanged', true),
    });
  };

  onSignInPasswordChanged = text => {
    this.setState({
      data: this.state.data.set('signInPassword', text).set('signInPasswordChanged', true),
    });
  };

  onSignUpEmailAddressChanged = text => {
    this.setState({
      data: this.state.data.set('signUpEmailAddress', text.toLowerCase()).set('signUpEmailAddressChanged', true),
    });
  };

  onSignUpPasswordChanged = text => {
    this.setState({
      data: this.state.data.set('signUpPassword', text).set('signUpPasswordChanged', true),
    });
  };

  onSignUpConfirmPasswordChanged = text => {
    this.setState({
      data: this.state.data.set('signUpConfirmPassword', text).set('signUpConfirmPasswordChanged', true),
    });
  };

  onSignInClicked = () => {
    if (this.state.data.get('signInInputAreaHidden')) {
      this.setState({
        data: this.state.data.set('signInInputAreaHidden', false).set('signUpInputAreaHidden', true),
      });
    } else {
      this.setState({
        data: this.state.data.set('signInButtonPressed', true),
      });

      if (!this.getSignInEmailErrorMessage(true) && !this.getSignInPasswordErrorMessage(true)) {
        this.props.onSignInClicked(this.state.data.get('signInEmailAddress'), this.state.data.get('signInPassword'));
      }
    }
  };

  onSignUpClicked = () => {
    if (this.state.data.get('signUpInputAreaHidden')) {
      this.setState({
        data: this.state.data.set('signInInputAreaHidden', true).set('signUpInputAreaHidden', false),
      });
    } else {
      this.setState({
        data: this.state.data.set('signUpButtonPressed', true),
      });

      if (!this.getSignUpEmailErrorMessage(true) && !this.getSignUpPasswordErrorMessage(true) && !this.getSignUpConfirmPasswordErrorMessage(true)) {
        this.props.onSignUpClicked(this.state.data.get('signUpEmailAddress'), this.state.data.get('signUpPassword'));
      }
    }
  };

  getSignInEmailErrorMessage = buttonPressed => {
    if (this.state.data.get('signInEmailAddressChanged') || buttonPressed) {
      const emailAddress = this.state.data.get('signInEmailAddress');

      if (emailAddress) {
        return emailValidator.validate(emailAddress) ? null : 'Email address is badly formatted.';
      } else {
        return 'Email address is required.';
      }
    } else {
      return null;
    }
  };

  getSignInPasswordErrorMessage = buttonPressed => {
    if (this.state.data.get('signInPasswordChanged') || buttonPressed) {
      return this.state.data.get('signInPassword') ? null : 'Password is required.';
    } else {
      return null;
    }
  };

  getSignUpEmailErrorMessage = buttonPressed => {
    if (this.state.data.get('signUpEmailAddressChanged') || buttonPressed) {
      const emailAddress = this.state.data.get('signUpEmailAddress');

      if (emailAddress) {
        return emailValidator.validate(emailAddress) ? null : 'Email address is badly formatted.';
      } else {
        return 'Email address is required.';
      }
    } else {
      return null;
    }
  };

  getSignUpPasswordErrorMessage = buttonPressed => {
    if (this.state.data.get('signUpPasswordChanged') || buttonPressed) {
      const password = this.state.data.get('signUpPassword');

      if (!password || password.trim().length === 0) {
        return 'Password is required.';
      } else if (password.trim().length < 6) {
        return 'Password length must be at least 6 characters.';
      } else if (password.trim().length > 100) {
        return 'Password length cannot be longer than 100 characters.';
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  getSignUpConfirmPasswordErrorMessage = buttonPressed => {
    if (this.state.data.get('signUpConfirmPasswordChanged') || buttonPressed) {
      if (this.getSignUpPasswordErrorMessage(buttonPressed)) {
        return null;
      }

      const password = this.state.data.get('signUpPassword');
      const confirmPassword = this.state.data.get('signUpConfirmPassword');

      if (password.localeCompare(confirmPassword) === 0) {
        return null;
      } else {
        return 'Please re-enter your password.';
      }
    } else {
      return null;
    }
  };

  renderErrorMessage = errorMessage => {
    if (errorMessage) {
      return <FormValidationMessage> {errorMessage}</FormValidationMessage>;
    } else {
      return <View />;
    }
  };

  renderFacebookButton = () => {
    return (
      <Button
        title="Sign in with Facebook"
        icon={{ name: 'facebook', type: 'material-community' }}
        backgroundColor="#3b5998"
        buttonStyle={Styles.button}
        onPress={this.props.onSignInWithFacebookClicked}
      />
    );
  };

  renderSignInButton = () => {
    return (
      <Button
        title="Sign in via Email"
        onPress={this.onSignInClicked}
        buttonStyle={Styles.button}
        containerViewStyle={Styles.signInButtonContainerViewStyle}
        icon={{ name: 'email', type: 'material-community' }}
        backgroundColor={Color.secondaryColorAction}
      />
    );
  };

  renderSignInInputArea = () => {
    return this.state.data.get('signInInputAreaHidden') ? (
      this.renderSignInButton()
    ) : (
      <View>
        <FormLabel>Email</FormLabel>
        <FormInput
          onChangeText={this.onSignInEmailAddressChanged}
          value={this.state.data.get('signInEmailAddress')}
          placeholder="Please enter your email address"
          keyboardType="email-address"
        />
        {this.renderErrorMessage(this.getSignInEmailErrorMessage(this.state.data.get('signInButtonPressed')))}
        <FormLabel>Password</FormLabel>
        <FormInput
          onChangeText={this.onSignInPasswordChanged}
          value={this.state.data.get('signInPassword')}
          placeholder="Please enter your password"
          secureTextEntry
        />
        {this.renderErrorMessage(this.getSignInPasswordErrorMessage(this.state.data.get('signInButtonPressed')))}
        {this.renderSignInButton()}
      </View>
    );
  };

  renderSignUpButton = () => {
    return (
      <Button
        raised
        title="Create Account"
        onPress={this.onSignUpClicked}
        buttonStyle={Styles.button}
        containerViewStyle={Styles.signUpButtonContainerViewStyle}
        icon={{ name: 'md-log-in', type: 'ionicon' }}
        backgroundColor={Color.primaryColorNormal}
      />
    );
  };

  renderSignUpInputArea = () => {
    return this.state.data.get('signUpInputAreaHidden') ? (
      this.renderSignUpButton()
    ) : (
      <View>
        <FormLabel>Email</FormLabel>
        <FormInput
          onChangeText={this.onSignUpEmailAddressChanged}
          value={this.state.data.get('signUpEmailAddress')}
          placeholder="Please enter your email address"
          keyboardType="email-address"
        />
        {this.renderErrorMessage(this.getSignUpEmailErrorMessage(this.state.data.get('signUpButtonPressed')))}
        <FormLabel>Password</FormLabel>
        <FormInput
          onChangeText={this.onSignUpPasswordChanged}
          value={this.state.data.get('signUpPassword')}
          placeholder="Please enter your password"
          secureTextEntry
        />
        {this.renderErrorMessage(this.getSignUpPasswordErrorMessage(this.state.data.get('signUpButtonPressed')))}
        <FormLabel>Re-type Password</FormLabel>
        <FormInput
          onChangeText={this.onSignUpConfirmPasswordChanged}
          value={this.state.data.get('signUpConfirmPassword')}
          placeholder="Please enter your password again"
          secureTextEntry
        />
        {this.renderErrorMessage(this.getSignUpConfirmPasswordErrorMessage(this.state.data.get('signUpButtonPressed')))}
        {this.renderSignUpButton()}
      </View>
    );
  };

  renderSignUpOrSignInIsInProgressIndicator = () => {
    if (this.props.signUpOrSignInIsInProgress) {
      return (
        <Row>
          <Col>
            <ActivityIndicator animating={this.props.signUpOrSignInIsInProgress} size="large" color="#3b5998" style={Styles.activityIndicator} />
          </Col>
        </Row>
      );
    } else {
      return <View />;
    }
  };

  render = () => {
    return (
      <ScrollView style={Styles.scrollView} keyboardShouldPersistTaps="always">
        {/*<View style={Styles.container}>*/}
        <View style={Styles.topContainer}>
          <Text h2 style={Styles.title}>
            {' '}
            FingerMenuRestaurant
          </Text>
        </View>

        <View>{this.renderSignUpOrSignInIsInProgressIndicator()}</View>
        <View>{this.renderFacebookButton()}</View>
        <View>{this.renderSignInInputArea()}</View>
        <View>{this.renderSignUpInputArea()}</View>
        <View />
        {/*</View>*/}
        {/*<Grid style={Styles.grid}>*/}
        {/*<Row>*/}
        {/*<Text h2 style={Styles.title}>*/}
        {/*{' '}*/}
        {/*FingerMenuRestaurant*/}
        {/*</Text>*/}
        {/*</Row>*/}
        {/*{this.renderSignUpOrSignInIsInProgressIndicator()}*/}
        {/*<Row>*/}
        {/*<Col>{this.renderFacebookButton()}</Col>*/}
        {/*</Row>*/}
        {/*<Row>*/}
        {/*<Col>{this.renderSignInInputArea()}</Col>*/}
        {/*</Row>*/}
        {/*<Row>*/}
        {/*<Col>{this.renderSignUpInputArea()}</Col>*/}
        {/*</Row>*/}
        {/*</Grid>*/}
      </ScrollView>
    );
  };
}

UserSignInSignUpPresentational.propTypes = {
  onSignInWithFacebookClicked: PropTypes.func.isRequired,
  onSignInClicked: PropTypes.func.isRequired,
  onSignUpClicked: PropTypes.func.isRequired,
  signUpOrSignInIsInProgress: PropTypes.bool.isRequired,
};

export default UserSignInSignUpPresentational;
