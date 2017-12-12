// @flow

import Immutable from 'immutable';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';
import FastImage from 'react-native-fast-image';
import { Text } from 'react-native-elements';
import { ProductProp } from './PropTypes';
import Styles from './Styles';
import MainStyles from '../../../framework/style/DefaultStyles';

function daysBetween(date1, date2) {
  //Get 1 day in milliseconds
  var one_day = 1000 * 60 * 60 * 24;

  // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();

  // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;

  // Convert back to days and return
  return Math.round(difference_ms / one_day);
}

function getExpiryDaysLeft(offerEndDate) {
  if (!offerEndDate) {
    return '';
  }

  const date = new Date(offerEndDate);

  return daysBetween(new Date(), date);
}

function getItemSubTitle(offerEndDate, multiBuy, unitPrice) {
  let subTitleItems = [];

  if (offerEndDate) {
    subTitleItems.push(getExpiryDaysLeft(offerEndDate) + 'd left');
  }

  if (multiBuy) {
    subTitleItems.push('Min:' + multiBuy.awardQuantity.toString());
  }

  if (unitPrice) {
    subTitleItems.push('$' + unitPrice.price.toFixed(2) + '/' + unitPrice.size);
  }

  return subTitleItems.join('|');
}

class ProductListRowItem extends Component {
  constructor(props, context) {
    super(props, context);

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

  render() {
    return (
      <Grid>
        <Col size={20}>
          {this.props.product.imageUrl ? (
            <FastImage style={Styles.productImage} resizeMode={FastImage.resizeMode.stretch} source={{ uri: this.props.product.imageUrl }} />
          ) : (
            <View />
          )}
        </Col>
        <Col size={5} />
        <Col size={80}>
          <Row>
            <Col size={70}>
              <Text style={MainStyles.primaryFont} numberOfLines={2}>
                {this.props.product.name}
              </Text>
            </Col>
            <Col size={30}>
              <Text style={Styles.productSize}>{this.props.product.size}</Text>
            </Col>
          </Row>
          <Row>
            <Col size={70}>
              <Text style={Styles.subTitle} numberOfLines={1}>
                {getItemSubTitle(this.props.product.offerEndDate, this.props.product.multibuy, this.props.product.unitPrice)}
              </Text>
            </Col>
            <Col size={30}>
              <Text style={Styles.priceToDisplay}>{this.props.product.priceToDisplay ? '$' + this.props.product.priceToDisplay.toFixed(2) : ''}</Text>
            </Col>
          </Row>

          <Row>
            <Col size={60}>
              <Row>
                <Col size={15}>
                  {this.props.product.store && this.props.product.store.imageUrl ? (
                    <FastImage
                      style={Styles.storeImage}
                      resizeMode={FastImage.resizeMode.stretch}
                      source={{ uri: this.props.product.store.imageUrl }}
                    />
                  ) : (
                    <View />
                  )}
                </Col>
                <Col size={85}>
                  <Text style={Styles.storeName} numberOfLines={1}>
                    {this.props.product.store ? this.props.product.store.name : ''}
                  </Text>
                </Col>
              </Row>
            </Col>
            <Col size={40}>
              {this.props.product.savingPercentage ? (
                <View style={Styles.pricing}>
                  <Text style={Styles.savingPercentage} numberOfLines={1}>
                    Save ${this.props.product.saving ? this.props.product.saving.toFixed(2) : ''}({this.props.product.savingPercentage.toFixed(0)}%){' '}
                  </Text>
                </View>
              ) : (
                <Text />
              )}
            </Col>
          </Row>
        </Col>
      </Grid>
    );
  }
}

ProductListRowItem.propTypes = {
  product: ProductProp,
};

export default ProductListRowItem;
