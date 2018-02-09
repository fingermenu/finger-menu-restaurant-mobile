// @flow

import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Field } from 'redux-form';
import Styles from './Styles';
import PropTypes from 'prop-types';
import { DefaultColor } from '../../style/DefaultStyles';

class ChoiceItemsListView extends Component {
  renderCheckbox = ({ input }) => {
    return (
      <CheckBox
        {...input}
        checked={!!input.value}
        onIconPress={() => {
          input.onChange(!input.value);
        }}
        containerStyle={Styles.checkbox}
        size={36}
        iconType="MaterialIcons"
        checkedIcon="check-box"
        uncheckedIcon="check-box-outline-blank"
        checkedColor={DefaultColor.defaultThemeColor}
      />
    );
  };

  renderItem = ({ item }) => {
    return (
      <View style={Styles.optionRowContainer}>
        <View style={Styles.checkboxContainer}>
          <Field name={item.id} component={this.renderCheckbox} />
        </View>
        <View style={Styles.optionContainer}>
          <Text style={Styles.optionName}>{item.choiceItem.name}</Text>
          <Text style={Styles.price}>{item.currentPrice}</Text>
        </View>
      </View>
    );
  };

  renderSectionHeader = ({ section }) => {
    return (
      <View style={Styles.sectionHeader}>
        <Text style={Styles.sectionTitle}>{section.optionType}</Text>
      </View>
    );
  };

  render = () => {
    // const sectionData = Immutable.fromJS(this.props.orderOptions)
    //   .groupBy(item => (item.has('type') && item.get('type') ? item.get('type') : 'Other'))
    //   .mapEntries(([key, value]) => [
    //     key,
    //     {
    //       data: value.toJS(),
    //       optionType: key,
    //     },
    //   ])
    //   .sortBy(_ => _.optionType)
    //   .valueSeq()
    //   .toJS();

    return (
      <View>
        <FlatList
          data={this.props.choiceItemPrices}
          keyExtractor={item => {
            return item.id;
          }}
          renderItem={item => this.renderItem(item)}
        />
        {/*<SectionList*/}
        {/*renderItem={this.renderItem}*/}
        {/*renderSectionHeader={this.renderSectionHeader}*/}
        {/*sections={sectionData}*/}
        {/*keyExtractor={item => item.id}*/}
        {/*// onEndReached={this.props.onEndReached}*/}
        {/*// onRefresh={this.props.onRefresh}*/}
        {/*// refreshing={this.props.isFetchingTop}*/}
        {/*// ItemSeparatorComponent={() => <ListItemSeparator />}*/}
        {/*/>*/}
      </View>
    );
  };
}

ChoiceItemsListView.propTypes = {
  choiceItemPrices: PropTypes.object.isRequired,
};

export default ChoiceItemsListView;
