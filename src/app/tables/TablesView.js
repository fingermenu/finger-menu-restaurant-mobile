// @flow

import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import { FlatList, Text, View, TouchableNative } from 'react-native';
import { TouchableItem } from '@microbusiness/common-react-native';
import { TablesProp } from './PropTypes';
import { Badge } from 'react-native-elements';
import Styles from './Styles';
import { translate } from 'react-i18next';

class TablesView extends Component {
  renderItem = item => {
    const style = this.getTableStyle(item.item.tableState ? item.item.tableState.key : 'empty');
    return (
      <TouchableItem onPress={() => this.props.onTablePressed(item.item)}>
        <View style={Styles.tableContainer}>
          <Badge
            value={item.item.name}
            textStyle={Styles.tableText}
            component={TouchableNative}
            containerStyle={[Styles.tableBadgeContainer, style]}
            wrapperStyle={Styles.tableBadgeWrapper}
          />
          <View style={Styles.tableTextContainer}>
            <Text>{item.item.numberOfAdults ? item.item.numberOfAdults : 0}</Text>
            <Text>{item.item.numberOfChildren ? item.item.numberOfChildren : 0}</Text>
          </View>
        </View>
      </TouchableItem>
    );
  };

  getTableStyle = tableState => {
    switch (tableState) {
      case 'taken':
        return Styles.tableBadgeTaken;

      case 'empty':
        return Styles.tableBadgeEmpty;

      case 'reserved':
        return Styles.tableBadgeReserve;

      case 'paid':
        return Styles.tableBadgePaid;
    }
  };

  renderBadgeSummaryItem = item => {
    const style = this.getTableStyle(item.key);

    return (
      <Badge
        value={item.key + ' ' + item.count}
        textStyle={Styles.tableText}
        component={TouchableNative}
        containerStyle={[Styles.tableBadgeContainer, style]}
        wrapperStyle={Styles.tableBadgeWrapper}
      />
    );
  };

  render = () => {
    const { t } = this.props;
    const groupedTables = Immutable.fromJS(this.props.tables)
      .groupBy(t => (t.has('tableState') ? t.getIn(['tableState', 'key']) : 'empty'))
      .mapEntries(([key, value]) => [
        key,
        {
          key: key ? key : 'empty',
          tables: value,
          count: value.count(),
        },
      ])
      .sortBy(_ => _.key)
      .valueSeq();
    // .toJS();

    return (
      <View style={Styles.container}>
        <View>
          <Text>{t('table.manageTable')}</Text>
        </View>
        <FlatList
          data={this.props.tables}
          keyExtractor={item => {
            return item.id;
          }}
          numColumns={3}
          renderItem={this.renderItem}
        />
        <View style={Styles.tableLegendsContainer}>
          {this.renderBadgeSummaryItem({
            key: 'empty',
            count: groupedTables.filter(t => t.key === 'empty').first() ? groupedTables.filter(t => t.key === 'empty').first().count : 0,
          })}
          {this.renderBadgeSummaryItem({
            key: 'taken',
            count: groupedTables.filter(t => t.key === 'taken').first() ? groupedTables.filter(t => t.key === 'taken').first().count : 0,
          })}
          {this.renderBadgeSummaryItem({
            key: 'reserved',
            count: groupedTables.filter(t => t.key === 'reserved').first() ? groupedTables.filter(t => t.key === 'reserved').first().count : 0,
          })}
          {this.renderBadgeSummaryItem({
            key: 'paid',
            count: groupedTables.filter(t => t.key === 'paid').first() ? groupedTables.filter(t => t.key === 'paid').first().count : 0,
          })}

          {/*<FlatList*/}
          {/*data={groupedTables}*/}
          {/*keyExtractor={item => {*/}
          {/*return item.key;*/}
          {/*}}*/}
          {/*numColumns={4}*/}
          {/*renderItem={this.renderBadgeSummaryItem}*/}
          {/*/>*/}
        </View>
      </View>
    );
  };
}

TablesView.propTypes = {
  menuItems: TablesProp,
  onTablePressed: PropTypes.func.isRequired,
};

export default translate()(TablesView);
