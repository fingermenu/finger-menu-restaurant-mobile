// @flow

import * as userAccessActions from 'micro-business-parse-server-common-react-native/src/userAccess/Actions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DrawerItems, NavigationActions } from 'react-navigation';
import { ScrollView, View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Styles from './Styles';

class AppDrawerMenuContainer extends Component {
  render = () => {
    return (
      <View style={Styles.container}>
        <View style={Styles.profile}>
          {this.props.avatarUrl ? (
            <Avatar containerStyle={Styles.profileAvatar} medium rounded source={{ uri: this.props.avatarUrl }} activeOpacity={0.7} />
          ) : (
            <Avatar containerStyle={Styles.profileAvatar} medium rounded icon={{ name: 'person', type: 'material-icons' }} activeOpacity={0.7} />
          )}
          <View style={Styles.profileDetail}>
            <Text>{this.props.name}</Text>
          </View>
        </View>
        <View style={Styles.menu}>
          <ScrollView>
            <DrawerItems {...this.props} />
          </ScrollView>
        </View>
      </View>
    );
  };
}
AppDrawerMenuContainer.propTypes = {
  userAccessActions: PropTypes.object.isRequired,
  gotoScreen: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    name: state.userAccess.getIn(['userInfo', 'name'])
      ? state.userAccess.getIn(['userInfo', 'name'])
      : state.userAccess.getIn(['userInfo', 'emailAddress']),
    avatarUrl: state.userAccess.getIn(['userInfo', 'avatar']) ? state.userAccess.getIn(['userInfo', 'avatar']).data.url : null,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userAccessActions: bindActionCreators(userAccessActions, dispatch),
    gotoScreen: routeName =>
      dispatch(
        NavigationActions.navigate({
          routeName,
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppDrawerMenuContainer);
