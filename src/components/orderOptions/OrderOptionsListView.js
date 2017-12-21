// @flow

import React, { Component } from 'react';
import { View, Text, SectionList } from 'react-native';
import { CheckBox } from 'react-native-elements';
import Immutable from 'immutable';
import { OrderOptionsProp } from './PropTypes';
import Styles from './Styles';
import { DefaultColor } from '../../style/DefaultStyles';

class OrderOptionsListView extends Component {
  renderItem = ({ item }) => {
    return (
      <View style={Styles.optionRowContainer}>
        <View />
        <CheckBox
          style={Styles.checkbox}
          center
          iconType="MaterialIcons"
          checkedIcon="check-box"
          uncheckedIcon="check-box-outline-blank"
          checkedColor={DefaultColor.defaultThemeColor}
          checked={true}
        />
        <Text style={Styles.optionName}>{item.name}</Text>
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
    const sectionData = Immutable.fromJS(this.props.orderOptions)
      .groupBy(item => (item.has('type') && item.get('type') ? item.get('type') : 'Other'))
      .mapEntries(([key, value]) => [
        key,
        {
          data: value.toJS(),
          optionType: key,
        },
      ])
      .sortBy(_ => _.optionType)
      .valueSeq()
      .toJS();

    return (
      <View>
        <SectionList
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          sections={sectionData}
          keyExtractor={item => item.id}
          // onEndReached={this.props.onEndReached}
          // onRefresh={this.props.onRefresh}
          // refreshing={this.props.isFetchingTop}
          // ItemSeparatorComponent={() => <ListItemSeparator />}
        />
      </View>
    );
  };
}

OrderOptionsListView.propTypes = {
  orderOptions: OrderOptionsProp,
};

export default OrderOptionsListView;
