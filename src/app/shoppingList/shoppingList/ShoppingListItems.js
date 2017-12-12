// @flow

import React, { Component } from 'react';
import { SectionList, Text, View, Image } from 'react-native';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { ShoppingListItemsProp } from './PropTypes';
import ActionButton from 'react-native-action-button';
import ShoppingListItem from './ShoppingListItem';
import { ListItemSeparator } from '../../../components/list';
import { ImageUltility } from '../../../components/image';
import Styles from './Styles';
import { Color } from '../../../framework/style/DefaultStyles';
import config from '../../../framework/config';

class ShoppingListItems extends Component {
  constructor(props, context) {
    super(props, context);

    this.onShoppingListAddItemClicked = debounce(this.props.onShoppingListAddItemClicked, config.navigationDelay);
  }

  renderItem = ({ item }) => {
    return (
      <ShoppingListItem
        shoppingListItem={item}
        onShoppingListItemSelectionChanged={this.props.onShoppingListItemSelectionChanged}
        onViewProductsPressed={this.props.onViewProductsPressed}
        onViewProductDetailPressed={this.props.onViewProductDetailPressed}
      />
    );
  };

  renderSectionHeader = ({ section }) => {
    return (
      <View style={Styles.sectionHeader}>
        <Text style={Styles.sectionTitle}>{section.categoryTitle}</Text>
        <Image source={ImageUltility.getImageSource(section.categoryKey.replace(/-/g, ''))} style={Styles.sectionHeaderImage} />
      </View>
    );
  };

  render = () => {
    let sectionData = Immutable.fromJS(this.props.shoppingListItems)
      .groupBy(
        item =>
          item.has('tags') && item.get('tags') && !item.get('tags').isEmpty()
            ? item
                .get('tags')
                .first()
                .get('name')
            : 'Other',
      )
      .mapEntries(([key, value]) => [
        key,
        {
          data: value.toJS(),
          categoryTitle: key,
          categoryKey:
            value.first().has('tags') &&
            value.first().get('tags') &&
            !value
              .first()
              .get('tags')
              .isEmpty()
              ? value
                  .first()
                  .get('tags')
                  .first()
                  .get('key')
              : key,
        },
      ])
      .sortBy(_ => _.categoryTitle)
      .valueSeq()
      .toJS();

    const hasItem = sectionData.length;

    return (
      <View style={Styles.container}>
        {hasItem ? (
          <View style={Styles.container}>
            <SectionList
              renderItem={this.renderItem}
              renderSectionHeader={this.renderSectionHeader}
              sections={sectionData}
              keyExtractor={item => item.id}
              onEndReached={this.props.onEndReached}
              onRefresh={this.props.onRefresh}
              refreshing={this.props.isFetchingTop}
              ItemSeparatorComponent={() => <ListItemSeparator />}
            />
          </View>
        ) : (
          <View style={Styles.addItemsBackgroundContainer}>
            <Image source={ImageUltility.getImageSource('groceries')} style={Styles.addItemsBackgroundImage} />
            <Text style={Styles.addItemsText}>Start adding products</Text>
            <Text style={Styles.addItemsText}>just tap the blue button</Text>
          </View>
        )}
        <ActionButton buttonColor={Color.actionButtonColor} offsetX={50} onPress={() => this.onShoppingListAddItemClicked()} />
      </View>
    );
  };
}

ShoppingListItems.propTypes = {
  shoppingListItems: ShoppingListItemsProp,
  onShoppingListItemSelectionChanged: PropTypes.func.isRequired,
  onViewProductsPressed: PropTypes.func.isRequired,
  onViewProductDetailPressed: PropTypes.func.isRequired,
  onShoppingListAddItemClicked: PropTypes.func.isRequired,
  isFetchingTop: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onEndReached: PropTypes.func.isRequired,
};

export default ShoppingListItems;
