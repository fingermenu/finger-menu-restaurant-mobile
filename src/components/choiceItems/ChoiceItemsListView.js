// @flow

import { CheckBox } from '@microbusiness/redux-form-react-native-elements';
import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Field } from 'redux-form';
import Styles from './Styles';
import { ListItemSeparator } from '../list';
import { ChoiceItemPricesProp } from './PropTypes';

class ChoiceItemsListView extends Component {
  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <View style={Styles.optionRowContainer}>
      <View style={Styles.checkboxContainer}>
        <Field name={item.id} component={CheckBox} />
      </View>
      <View style={Styles.optionContainer}>
        <Text style={Styles.optionName}>{item.choiceItem.name}</Text>
        <Text style={Styles.price}>${item.currentPrice}</Text>
      </View>
    </View>
  );

  renderSectionHeader = sectionTitle => (
    <View style={Styles.sectionHeader}>
      <Text style={Styles.sectionTitle}>{sectionTitle}</Text>
      <ListItemSeparator />
    </View>
  );

  render = () => (
    <View>
      {this.props.choiceItemPrices.length > 0 ? this.renderSectionHeader('Would you like some sides?') : <View />}
      <FlatList data={this.props.choiceItemPrices} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
    </View>
  );
}

ChoiceItemsListView.propTypes = {
  choiceItemPrices: ChoiceItemPricesProp.isRequired,
};

export default ChoiceItemsListView;
