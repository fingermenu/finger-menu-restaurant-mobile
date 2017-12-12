// @flow

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { FormInput, Avatar, Icon, FormValidationMessage } from 'react-native-elements';
import Styles from './Styles';
import { TouchableItem } from '../../../components/touchableIcon';
import { Color } from '../../../framework/style/DefaultStyles';

class ShoppingListDetail extends Component {
  render = () => {
    return (
      <View style={Styles.container}>
        <View style={Styles.listNameContainer}>
          <Text style={Styles.listNameLabel}>List Name</Text>
          <FormInput
            inputStyle={Styles.listNameInput}
            autoFocus={true}
            placeholder="Please enter list name..."
            placeholderTextColor="white"
            onChangeText={name => this.props.shoppingListNameChanged(name)}
            value={this.props.shoppingListName}
          />
          <FormValidationMessage>
            {this.props.shoppingListName ? (this.props.shoppingListName.length > 20 ? 'List name must be less than 20 characters' : '') : ''}
          </FormValidationMessage>
        </View>
        <View style={Styles.membersContainer}>
          <Text style={Styles.membersLabel}>List Members</Text>
          <View style={Styles.avatarContainer}>
            {this.props.avatarUrl ? (
              <Avatar containerStyle={Styles.profileAvatar} small rounded source={{ uri: this.props.avatarUrl }} activeOpacity={0.7} />
            ) : (
              <Avatar containerStyle={Styles.profileAvatar} small rounded icon={{ name: 'person', type: 'material-icons' }} activeOpacity={0.7} />
            )}
            <Text style={Styles.memberName}>You</Text>
          </View>
          <View style={Styles.avatarContainer}>
            {/* <View style={Styles.container}> */}
            <TouchableItem
              accessibilityComponentType="button"
              accessibilityTraits="button"
              delayPressIn={0}
              style={Styles.touchableContainer}
              borderless
            >
              <Icon size={38} color={Color.primaryColorDark} name="plus-circle-outline" type="material-community" />
            </TouchableItem>
            {/* </View> */}
            <Text style={Styles.invite}>Invite People</Text>
          </View>
        </View>
      </View>
    );
  };
}

export default ShoppingListDetail;
