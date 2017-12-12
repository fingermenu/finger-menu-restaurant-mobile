// @flow

import React from 'react';
import { TouchableHighlight, View } from 'react-native';
import { Col, Grid } from 'react-native-easy-grid';
import { CheckBox, ListItem, Avatar, Text } from 'react-native-elements';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { ShoppingListItemProp } from './PropTypes';
import Styles from './Styles';
import { ImageUltility } from '../../../components/image';
import { ProductListRow } from '../../products';
import config from '../../../framework/config';

class ShoppingListItem extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.onViewProductsPressed = debounce(this.props.onViewProductsPressed, config.navigationDelay);
    this.onViewProductDetailPressed = debounce(this.props.onViewProductDetailPressed, config.navigationDelay);
  }

  renderStapleListItem = stapleItemName => {
    return (
      <View style={Styles.stapleItemNameContainer}>
        <Avatar
          width={24}
          height={24}
          overlayContainerStyle={Styles.stapleItemIconContainer}
          source={ImageUltility.getImageSource(stapleItemName.toLowerCase().replace(/\s+/g, ''))}
          activeOpacity={0.1}
        />
        <Text style={Styles.stapleItemName}>{stapleItemName}</Text>
      </View>
    );
  };

  render() {
    if (this.props.shoppingListItem.stapleItemId) {
      // Staple item
      return (
        <ListItem
          containerStyle={Styles.stapleItemRow}
          avatar={
            <CheckBox
              containerStyle={Styles.stapleItemCheckbox}
              checked={false}
              center
              onPress={() => this.props.onShoppingListItemSelectionChanged(this.props.shoppingListItem)}
            />
          }
          key={this.props.shoppingListItem.name}
          title={this.renderStapleListItem(this.props.shoppingListItem.name)}
          onPressRightIcon={() => this.onViewProductsPressed(this.props.shoppingListItem.id)}
        />
      );
    } else {
      return (
        <TouchableHighlight underlayColor="whitesmoke" style={Styles.specialItemRow}>
          <Grid>
            <CheckBox
              containerStyle={Styles.productItemCheckBox}
              checked={false}
              center
              onPress={() => this.props.onShoppingListItemSelectionChanged(this.props.shoppingListItem)}
            />
            <Col>
              <ProductListRow
                product={this.props.shoppingListItem}
                onViewProductDetailPressed={() =>
                  this.onViewProductDetailPressed(this.props.shoppingListItem.productPriceId, this.props.shoppingListItem.name)
                }
                onItemSelectionChanged={() =>
                  this.onViewProductDetailPressed(this.props.shoppingListItem.productPriceId, this.props.shoppingListItem.name)
                }
                isInShoppingList={true}
              />
            </Col>
          </Grid>
        </TouchableHighlight>
      );
    }
  }
}

ShoppingListItem.propTypes = {
  shoppingListItem: ShoppingListItemProp,
  onShoppingListItemSelectionChanged: PropTypes.func.isRequired,
  onViewProductsPressed: PropTypes.func.isRequired,
};

export default ShoppingListItem;
