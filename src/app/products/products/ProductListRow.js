// @flow

import Immutable from 'immutable';
import React, { Component } from 'react';
import { View, Animated, Easing, Text } from 'react-native';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { ProductProp } from './PropTypes';
import Styles from './Styles';
import ProductListRowItem from './ProductListRowItem';
import { TouchableIcon, TouchableItem } from '../../../components/touchableIcon';
import { Color } from '../../../framework/style/DefaultStyles';
import config from '../../../framework/config';

class ProductListRow extends Component {
  constructor(props, context) {
    super(props, context);

    this.animatedValue = new Animated.Value(0);
    this.onViewProductDetailPressed = debounce(this.props.onViewProductDetailPressed, config.navigationDelay);

    this.state = { product: Immutable.fromJS(props.product) };
  }

  shouldComponentUpdate = nextProps => {
    return this.state.product.equals(Immutable.fromJS(nextProps.product));
  };

  componentWillReceiveProps = nextProps => {
    const product = Immutable.fromJS(nextProps.product);

    if (!this.state.product.equals(product)) {
      this.setState({ product });
    }
  };

  animate = easing => {
    this.animatedValue.setValue(0);

    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 1000,
      easing,
    }).start();
  };

  onProductItemSelected = product => {
    this.props.onItemSelectionChanged(product);

    if (this.props.animateOnProductSelected) {
      this.animate(Easing.ease);
    }
  };

  render() {
    const marginLeft = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [200, 350],
    });
    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0],
    });

    return (
      <TouchableItem onPress={() => this.onProductItemSelected(this.props.product)} style={Styles.productListItemRow}>
        <View style={Styles.productListItemRowContainer}>
          <ProductListRowItem product={this.props.product} />
          <TouchableIcon
            iconName="chevron-right"
            iconType="material-community"
            iconContainerStyle={Styles.viewProductIconContainerStyle}
            iconColor={Color.primaryFontColor}
            onPress={() => this.onViewProductDetailPressed(this.props.product.id, this.props.product.name)}
          />
          <Animated.View style={{ marginLeft, opacity, position: 'absolute', paddingTop: 55 }}>
            <Text style={Styles.itemAddedText}>Added to list</Text>
          </Animated.View>
        </View>
      </TouchableItem>
    );
  }
}

ProductListRow.propTypes = {
  product: ProductProp,
  onItemSelectionChanged: PropTypes.func.isRequired,
  onViewProductDetailPressed: PropTypes.func.isRequired,
  animateOnProductSelected: PropTypes.bool,
};

ProductListRow.defaultProps = {
  animateOnProductSelected: false,
};

export default ProductListRow;
