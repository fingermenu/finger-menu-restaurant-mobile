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
    return (
      <TouchableItem onPress={() => this.props.onTablePressed(item.item)}>
        <View style={Styles.tableContainer}>
          <Badge
            value={item.item.name}
            textStyle={Styles.tableText}
            component={TouchableNative}
            containerStyle={Styles.tableBadgeContainer}
            wrapperStyle={Styles.tableBadgeWrapper}
          />
          <View style={Styles.tableTextContainer}>
            <Text>{item.item.numberOfAdults ? item.item.numberOfAdults : 0}</Text>
            <Text>{item.item.numberOfChildren ? item.item.numberOfAdults : 0}</Text>
          </View>
        </View>
      </TouchableItem>
    );
  };

  renderBadgeSummaryItem = item => {
    let style = null;
    switch (item.item.key) {
      case 'taken':
        style = Styles.tableBadgeTaken;
        break;

      case 'empty':
        style = Styles.tableBadgeEmpty;
        break;

      case 'reserve':
        style = Styles.tableBadgeReserve;
        break;

      case 'paid':
        style = Styles.tableBadgePaid;
        break;
    }

    return (
      <Badge
        value={item.item.key + ' ' + item.item.count}
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
      .groupBy(t => t.getIn(['tableState', 'key']))
      .mapEntries(([key, value]) => [
        key,
        {
          key,
          tables: value,
          count: value.count(),
        },
      ])
      .sortBy(_ => _.key)
      .valueSeq()
      .toJS();

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
          <FlatList
            data={groupedTables}
            keyExtractor={item => {
              return item.key;
            }}
            numColumns={4}
            renderItem={this.renderBadgeSummaryItem}
          />
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
