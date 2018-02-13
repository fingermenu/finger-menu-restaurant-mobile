// @flow

import React, { Component } from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import { FlatList, Text, View, TouchableNative } from 'react-native';
import { Badge } from 'react-native-elements';
import { translate } from 'react-i18next';
import TableView from './TableView';
import Styles from './Styles';
import Common from './Common';

class TablesView extends Component {
  keyExtractor = item => item.id;

  renderItem = item => <TableView table={item.item} onTablePressed={this.props.onTablePressed} />;

  renderBadgeSummaryItem = item => {
    const style = Common.getTableStyle(item.key);

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

    return (
      <View style={Styles.container}>
        <View>
          <Text>{t('table.manageTable')}</Text>
        </View>
        <FlatList data={this.props.tables} keyExtractor={this.keyExtractor} numColumns={3} renderItem={this.renderItem} />
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
        </View>
      </View>
    );
  };
}

TablesView.propTypes = {
  onTablePressed: PropTypes.func.isRequired,
};

export default translate()(TablesView);
