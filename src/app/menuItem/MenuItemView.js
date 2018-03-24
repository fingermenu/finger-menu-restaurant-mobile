// @flow

import { TextInput } from '@microbusiness/redux-form-react-native-elements';
import { ListItemSeparator, TouchableItem } from '@microbusiness/common-react-native';
import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { translate } from 'react-i18next';
import { MenuItemPriceProp } from './PropTypes';
import Styles from './Styles';
import { ChoiceItemPrices } from '../../components/choiceItems';
import { QuantityControl } from '../../components/redux-form-components';
import { DefaultStyles } from '../../style';

class MenuItemView extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      quantity: props.initialValues.quantity,
    };
  }

  handleQuantityChanged = quantity => {
    this.setState({ quantity });
  };

  render = () => {
    const {
      t,
      handleSubmit,
      menuItemPrice: { menuItem: { name, description, imageUrl }, choiceItemPrices },
      isAddingToOrder,
      menuItemPrice,
    } = this.props;

    return (
      <View style={Styles.container}>
        <ScrollView>
          <View style={Styles.imageContainer}>{imageUrl ? <FastImage style={Styles.image} source={{ uri: imageUrl }} /> : <View />}</View>
          <View style={Styles.descriptionContainer}>
            <View style={Styles.nameContainer}>
              <Text style={DefaultStyles.primaryTitleFont}>{name}</Text>
              <Text style={Styles.price}>${menuItemPrice.currentPrice}</Text>
            </View>
            <Text style={Styles.description}>{description}</Text>
          </View>
          <Field name="notes" component={TextInput} placeholder={t('notes.placeholder')} />
          <View style={Styles.optionsContainer}>
            {choiceItemPrices.length > 0 && (
              <View style={Styles.choiceItemSectionHeader}>
                <Text style={Styles.choiceItemSectionTitle}>{t('wouldYouLikeSomeSides')}</Text>
                <ListItemSeparator />
              </View>
            )}
            <ChoiceItemPrices choiceItemPrices={choiceItemPrices} />
          </View>
        </ScrollView>
        <View>
          <View style={Styles.quantityContainer}>
            <Text style={DefaultStyles.primaryLabelFont}>{t('quantity')}</Text>
            <Field name="quantity" component={QuantityControl} onChange={this.handleQuantityChanged} />
          </View>

          {isAddingToOrder ? (
            <TouchableItem onPress={handleSubmit} style={Styles.addOrUpdateButtoncontainer}>
              <Text style={Styles.text}>{t('addToOrder').replace('{quantity}', this.state.quantity)}</Text>
            </TouchableItem>
          ) : (
            <TouchableItem onPress={handleSubmit} style={Styles.addOrUpdateButtoncontainer}>
              <Text style={Styles.text}>{t('updateOrder.button')}</Text>
            </TouchableItem>
          )}
        </View>
      </View>
    );
  };
}

MenuItemView.propTypes = {
  menuItemPrice: MenuItemPriceProp.isRequired,
  order: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  isAddingToOrder: PropTypes.bool.isRequired,
};

MenuItemView.defaultProps = {
  order: null,
};

function mapStateToProps(state, props) {
  const initialValues = { quantity: props.order ? props.order.quantity : 1, notes: props.order ? props.order.notes : null };

  if (props.order) {
    props.order.orderChoiceItemPrices.forEach(ocp => {
      initialValues[ocp.choiceItemPriceId] = true;
    });
  }

  // Set the initial values of orderChoiceItems when viewing an existing order.
  return {
    initialValues,
  };
}

// export default MenuItemView;
export default connect(mapStateToProps)(reduxForm({ form: 'menuItem' })(translate()(MenuItemView)));
