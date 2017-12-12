// @flow
import * as userAccessActions from 'micro-business-parse-server-common-react-native/src/userAccess/Actions';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Linking } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Settings from './Settings';
import { MainMenuContainer } from '../../sharedComponents/mainMenu';
import { Color } from '../../framework/style/DefaultStyles';

class SettingsContainer extends Component {
  static navigationOptions = {
    headerLeft: <MainMenuContainer />,
    headerTitle: 'Settings',
    headerTintColor: Color.headerIconDefaultColor,
    headerStyle: {
      backgroundColor: Color.secondaryColorAction,
    },
  };

  handleClickHyperLink = url => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  handleClickPrivacyPolicyLink = () => {
    this.handleClickHyperLink('http://www.fingermenurestaurant.co.nz/index.php/privacy');
  };

  handleClickOpenSourceLicensesLink = () => {
    this.handleClickHyperLink('http://www.fingermenurestaurant.co.nz/index.php/copyright');
  };

  handleClickTermsAndConditionLink = () => {
    this.handleClickHyperLink('http://www.fingermenurestaurant.co.nz/index.php/term-and-conditions');
  };

  signOut = () => {
    this.props.userAccessActions.signOut();
  };

  render = () => {
    return (
      <Settings
        signOut={this.signOut}
        handleClickTermsAndConditionLink={this.handleClickTermsAndConditionLink}
        handleClickOpenSourceLicensesLink={this.handleClickOpenSourceLicensesLink}
        handleClickPrivacyPolicyLink={this.handleClickPrivacyPolicyLink}
      />
    );
  };
}

SettingsContainer.propTypes = {
  userAccessActions: PropTypes.object.isRequired,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    userAccessActions: bindActionCreators(userAccessActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsContainer);
