// @flow

import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Card, Avatar, Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import Styles from './Styles';
import { StoreProp } from './PropTypes';

const StoreDetailView = ({ store }) => (
  <View style={Styles.container}>
    <ScrollView>
      <View style={Styles.storeInfoHeaderContainer}>
        <View>
          {store.imageUrl ? (
            <Avatar large rounded source={{ uri: store.imageUrl }} activeOpacity={0.7} />
          ) : (
            <Avatar large rounded title={store.name} activeOpacity={0.7} />
          )}
        </View>
        <Text style={Styles.storeName}>{store.name}</Text>
      </View>
      <Card title="Store Contact">
        <View style={Styles.storeInfoContainer}>
          <View style={Styles.storeInfoRow}>
            <Icon size={32} name="location-city" type="material" />
            <Text style={Styles.storeInfoRowText}>{store.address}</Text>
          </View>
          <View style={Styles.storeInfoRow}>
            <Icon size={32} name="phone" type="material-community" />
            <Text style={Styles.storeInfoRowText}>{store.phones && store.phones.length > 0 ? store.phones[0].number : ''}</Text>
          </View>
        </View>
      </Card>
      <Card title="Opening Hours">
        <View style={Styles.storeInfoContainer}>
          <View style={Styles.storeInfoRow}>
            <Icon size={32} name="ios-clock-outline" type="ionicon" />
            <Text style={Styles.storeInfoRowText}>{store.openingHours ? store.openingHours.from + ' - ' + store.openingHours.until : ''}</Text>
          </View>
        </View>
      </Card>
    </ScrollView>
  </View>
);

StoreDetailView.propTypes = {
  store: StoreProp,
  handleVisitStorePressed: PropTypes.func.isRequired,
};

export default StoreDetailView;
