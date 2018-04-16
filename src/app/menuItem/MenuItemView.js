// @flow

import { Common } from '@microbusiness/common-javascript';
import { TextInput } from '@microbusiness/redux-form-react-native-elements';
import { ListItemSeparator, TouchableItem } from '@microbusiness/common-react-native';
import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { translate } from 'react-i18next';
import int from 'int';
import { MenuItemPriceProp } from './PropTypes';
import Styles from './Styles';
import { ChoiceItemPrices } from '../../components/choiceItems';
import { QuantityControl } from '../../components/quantityControl';
import { DefaultStyles } from '../../style';
import RadioSet from '../../components/radioSet/RadioSet';

const MenuItemView = ({
  t,
  handleSubmit,
  menuItemPrice: {
    menuItem: { name, description, imageUrl },
  },
  isAddingOrder,
  menuItemPrice,
  quantity,
  choiceItemPricesOfTypeDietaryOption,
  choiceItemPricesOfTypeSize,
  otherChoiceItemPrices,
  onQuantityChanged,
}) => {
  return (
    <View style={Styles.container}>
      <ScrollView>
        <View style={Styles.imageContainer}>
          {imageUrl ? <FastImage style={Styles.image} resizeMode={FastImage.resizeMode.stretch} source={{ uri: imageUrl }} /> : <View />}
        </View>
        <View style={Styles.descriptionContainer}>
          <View style={Styles.nameContainer}>
            <Text style={DefaultStyles.primaryTitleFont}>{name}</Text>
            <Text style={Styles.price}>${menuItemPrice.currentPrice.toFixed(2)}</Text>
          </View>
          <Text style={Styles.description}>{description}</Text>
        </View>
        <Field name="notes" component={TextInput} placeholder={t('notes.placeholder')} />
        {choiceItemPricesOfTypeSize.length > 0 && (
          <View style={Styles.optionsContainer}>
            <View style={Styles.choiceItemSectionHeader}>
              <Text style={Styles.choiceItemSectionTitle}>{t('sizes.label')}</Text>
              <ListItemSeparator />
            </View>
            <Field
              radios={choiceItemPricesOfTypeSize.map(choiceItemPrice => ({
                id: choiceItemPrice.id,
                label: choiceItemPrice.choiceItem.name,
              }))}
              name="sizes"
              component={RadioSet}
            />
          </View>
        )}
        {choiceItemPricesOfTypeDietaryOption.length > 0 && (
          <View style={Styles.optionsContainer}>
            <View style={Styles.choiceItemSectionHeader}>
              <Text style={Styles.choiceItemSectionTitle}>{t('dietaryOptions.label')}</Text>
              <ListItemSeparator />
            </View>
            <ChoiceItemPrices choiceItemPrices={choiceItemPricesOfTypeDietaryOption} />
          </View>
        )}
        {otherChoiceItemPrices.length > 0 && (
          <View style={Styles.optionsContainer}>
            <View style={Styles.choiceItemSectionHeader}>
              <Text style={Styles.choiceItemSectionTitle}>{t('wouldYouLikeSomeSides.message')}</Text>
              <ListItemSeparator />
            </View>
            <ChoiceItemPrices choiceItemPrices={otherChoiceItemPrices} />
          </View>
        )}
      </ScrollView>
      <View>
        <View style={Styles.quantityContainer}>
          <Text style={DefaultStyles.primaryLabelFont}>{t('quantity.label')}</Text>
          <QuantityControl value={quantity} onChange={onQuantityChanged} />
        </View>

        {isAddingOrder ? (
          <TouchableItem onPress={handleSubmit} style={Styles.addOrUpdateButtoncontainer}>
            <Text style={Styles.text}>{t('addToOrder.button').replace('{quantity}', quantity)}</Text>
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

MenuItemView.propTypes = {
  menuItemPrice: MenuItemPriceProp.isRequired,
  isAddingOrder: PropTypes.bool.isRequired,
  quantity: PropTypes.number.isRequired,
  onQuantityChanged: PropTypes.func.isRequired,
};

function mapStateToProps(state, { menuItemPrice: { choiceItemPrices }, dietaryOptions, sizes }) {
  const typeFilterPredicate = (choiceItemPrice, items) =>
    !!choiceItemPrice.tags.find(tag => !!items.find(item => item.tag.id.localeCompare(tag.id) === 0));
  const sortFunc = (choiceItemPrice1, choiceItemPrice2) => int(choiceItemPrice1.sortOrderIndex).cmp(choiceItemPrice2.sortOrderIndex);
  const choiceItemPricesOfTypeDietaryOption = choiceItemPrices
    .filter(choiceItemPrice => typeFilterPredicate(choiceItemPrice, dietaryOptions))
    .sort(sortFunc);
  const choiceItemPricesOfTypeSize = choiceItemPrices.filter(choiceItemPrice => typeFilterPredicate(choiceItemPrice, sizes)).sort(sortFunc);
  const otherChoiceItemPrices = choiceItemPrices
    .filter(choiceItemPrice => Common.isUndefined(choiceItemPricesOfTypeDietaryOption.find(_ => _.id.localeCompare(choiceItemPrice.id) === 0)))
    .filter(choiceItemPrice => Common.isUndefined(choiceItemPricesOfTypeSize.find(_ => _.id.localeCompare(choiceItemPrice.id) === 0)))
    .sort(sortFunc);

  const activeOrderMenuItemPrice = state.applicationState.get('activeOrderMenuItemPrice');
  const activeOrderDetail = activeOrderMenuItemPrice.isEmpty()
    ? null
    : state.applicationState.getIn(['activeOrder', 'details', activeOrderMenuItemPrice.get('id')]);
  const initialValues = {
    notes: activeOrderDetail ? activeOrderDetail.get('notes') : null,
    sizes: {},
  };

  if (activeOrderDetail) {
    activeOrderDetail.get('orderChoiceItemPrices').forEach(ocp => {
      initialValues[ocp.getIn(['choiceItemPrice', 'id'])] = true;
      initialValues.sizes[ocp.getIn(['choiceItemPrice', 'id'])] = true;
    });
  }

  return {
    initialValues,
    choiceItemPricesOfTypeDietaryOption,
    choiceItemPricesOfTypeSize,
    otherChoiceItemPrices,
  };
}

// export default MenuItemView;
export default connect(mapStateToProps)(reduxForm({ form: 'menuItem' })(translate()(MenuItemView)));
