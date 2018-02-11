// @flow

import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Field } from 'redux-form';
import Styles from './Styles';
import PropTypes from 'prop-types';
import { CheckBox } from '../../components/redux-form-components';

class ChoiceItemsListView extends Component {
  render = () => (
    <View>
      <FlatList data={this.props.choiceItemPrices} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
    </View>
  );

  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <View style={Styles.optionRowContainer}>
      <View style={Styles.checkboxContainer}>
        <Field name={item.id} component={CheckBox} />
      </View>
      <View style={Styles.optionContainer}>
        <Text style={Styles.optionName}>{item.choiceItem.name}</Text>
        <Text style={Styles.price}>{item.currentPrice}</Text>
      </View>
    </View>
  );

  renderSectionHeader = ({ section }) => (
    <View style={Styles.sectionHeader}>
      <Text style={Styles.sectionTitle}>{section.optionType}</Text>
    </View>
  );
}

ChoiceItemsListView.propTypes = {
  choiceItemPrices: PropTypes.object.isRequired,
};

export default ChoiceItemsListView;
