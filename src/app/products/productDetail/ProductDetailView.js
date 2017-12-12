// @flow

import React, { Component } from 'react';
import { Text, View, Image, ScrollView } from 'react-native';
import { Card, Icon, Avatar } from 'react-native-elements';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import Styles from './Styles';
import { Color } from '../../../framework/style/DefaultStyles';
import { ProductProp } from './PropTypes';
import { TouchableIcon } from '../../../components/touchableIcon';
import config from '../../../framework/config';

class ProductDetailView extends Component {
  constructor(props, context) {
    super(props, context);

    this.onViewStorePressed = debounce(this.props.onViewStorePressed, config.navigationDelay);
    this.onViewStoreOnMapPressed = debounce(this.props.onViewStoreOnMapPressed, config.navigationDelay);
  }

  render = () => {
    const { product, handleVisitStorePressed, isInShoppingList, onAddProductPressed } = this.props;

    return (
      <View style={Styles.container}>
        <ScrollView style={Styles.scrollViewContainer}>
          <Image source={{ uri: product.imageUrl }} resizeMode="contain" style={Styles.productImage} />
          <View style={Styles.productTitleContainer}>
            <Text style={Styles.productTitle}>{product.name}</Text>
            <View style={Styles.rowContainer}>
              <Text style={Styles.priceToDisplay}>${product.priceToDisplay.toFixed(2)}</Text>
              <Text style={Styles.savingPercentageSmall}>
                {product.saving ? 'Save $' + product.saving.toFixed(2) + '(' + product.savingPercentage.toFixed(0) + '%)' : ''}
              </Text>
              <Text>{product.offerEndDate ? product.offerEndDate + 'day(s) left' : ''}</Text>
            </View>
          </View>
          <Card title="Detail">
            <Text style={Styles.productDescription}>{product.description}</Text>
            {product.size && (
              <View style={Styles.rowContainer}>
                <Icon style={Styles.icon} color="#bfc4c9" name="weight" type="material-community" />
                <Text>Size: </Text>
                <Text style={Styles.productSize}>{product.size}</Text>
              </View>
            )}
            {product.unitPrice && (
              <View style={Styles.rowContainer}>
                <Icon style={Styles.icon} color="#bfc4c9" name="md-pricetag" type="ionicon" />
                <Text> Price per unit: </Text>
                <Text style={Styles.unitPrice}>{'$' + product.unitPrice.price.toFixed(2) + '/' + product.unitPrice.size}</Text>
              </View>
            )}
            <View style={Styles.rowContainer}>
              {product.productPageUrl && (
                <View>
                  <Icon style={Styles.icon} color="#bfc4c9" name="web" type="material-community" />
                  <Text style={Styles.link} onPress={handleVisitStorePressed}>
                    View on web
                  </Text>
                </View>
              )}
            </View>
          </Card>
          <Card title="Store Info">
            <View style={Styles.storeInfoContainer}>
              <View>
                {product.store &&
                  product.store.imageUrl && (
                    <Avatar
                      medium
                      rounded
                      source={{ uri: product.store.imageUrl }}
                      activeOpacity={0.7}
                      onPress={() => this.onViewStorePressed(product.store.id)}
                    />
                  )}
              </View>
              <View style={Styles.storeDetail}>
                <Text onPress={this.onViewStorePressed}>{product.store ? product.store.name : ''}</Text>
              </View>
              {product.store &&
                product.store.googleMapUrl && (
                  <Icon style={Styles.icon} color="#bfc4c9" name="map-marker" type="material-community" onPress={this.onViewStoreOnMapPressed} />
                )}
            </View>
          </Card>
        </ScrollView>
        <View style={Styles.addProductContainer}>
          <View style={Styles.productPriceContainer}>
            <Text style={Styles.priceToDisplay}>${product.priceToDisplay.toFixed(2)}</Text>
            <Text style={Styles.savingPercentage}>
              {product.saving ? 'Save $' + product.saving.toFixed(2) + '(' + product.savingPercentage.toFixed(0) + '%)' : ''}
            </Text>
          </View>
          <View>
            <TouchableIcon
              iconName={isInShoppingList ? 'check-circle-outline' : 'plus-circle'}
              iconType="material-community"
              iconColor={Color.secondaryColorAction}
              iconSize={40}
              disabled={isInShoppingList}
              onPress={() => onAddProductPressed(product.id)}
            />
          </View>
        </View>
      </View>
    );
  };
}

ProductDetailView.propTypes = {
  product: ProductProp,
  handleVisitStorePressed: PropTypes.func.isRequired,
  onAddProductPressed: PropTypes.func.isRequired,
  onViewStorePressed: PropTypes.func.isRequired,
  onViewStoreOnMapPressed: PropTypes.func.isRequired,
  isInShoppingList: PropTypes.bool.isRequired,
};

export default ProductDetailView;
