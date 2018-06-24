// @flow

import { Common } from '@microbusiness/common-javascript';
import { TextInput } from '@microbusiness/redux-form-react-native-elements';
import { ListItemSeparator } from '@microbusiness/common-react-native';
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { translate } from 'react-i18next';
import int from 'int';
import { MenuItemPriceProp } from './PropTypes';
import Styles from './Styles';
import { ChoiceItemPrices } from '../../components/choiceItemPrices';
import { DietaryOptions } from '../../components/dietaryOptions';
import { SizeItemPrices } from '../../components/sizeItems';
import { QuantityControl } from '../../components/quantityControl';
import { DefaultStyles } from '../../style';

const MenuItemView = ({
  t,
  handleSubmit,
  menuItemPrice: {
    menuItem: { name, description, imageUrl },
    rules: { mustChooseSize, mustChooseDietaryOption, minNumberOfSideDishes, maxNumberOfSideDishes },
  },
  isAddingOrder,
  menuItemPrice,
  quantity,
  choiceItemPricesOfTypeDietaryOption,
  choiceItemPricesOfTypeSize,
  otherChoiceItemPrices,
  onQuantityChanged,
  valid,
}) => (
  <View style={Styles.container}>
    <ScrollView>
      <View style={Styles.imageContainer}>
        {imageUrl ? <FastImage style={Styles.image} resizeMode={FastImage.resizeMode.stretch} source={{ uri: imageUrl }} /> : <View />}
      </View>
      <View style={Styles.descriptionContainer}>
        <View style={Styles.nameContainer}>
          <Text style={DefaultStyles.primaryTitleFont}>
            {name}
          </Text>
          {menuItemPrice.currentPrice !== 0 && (
            <Text style={Styles.price}>
              $
              {menuItemPrice.currentPrice.toFixed(2)}
            </Text>
          )}
        </View>
        <Text style={DefaultStyles.primaryLabelFont}>
          {description}
        </Text>
      </View>
      <Field name="notes" component={TextInput} placeholder={t('notes.placeholder')} />
      {choiceItemPricesOfTypeSize.length > 0 && (
        <View style={Styles.optionsContainer}>
          <View style={Styles.choiceItemSectionHeader}>
            <Text style={DefaultStyles.primaryLabelFont}>
              {t('sizes.label')}
            </Text>
            <ListItemSeparator />
          </View>
          <SizeItemPrices sizeItemPrices={choiceItemPricesOfTypeSize} mustChooseSize={mustChooseSize} />
        </View>
      )}
      {choiceItemPricesOfTypeDietaryOption.length > 0 && (
        <View style={Styles.optionsContainer}>
          <View style={Styles.choiceItemSectionHeader}>
            <Text style={DefaultStyles.primaryLabelFont}>
              {t('dietaryOptions.label')}
            </Text>
            <ListItemSeparator />
          </View>
          <DietaryOptions dietaryOptions={choiceItemPricesOfTypeDietaryOption} mustChooseDietaryOption={mustChooseDietaryOption} />
        </View>
      )}
      {otherChoiceItemPrices.length > 0 && (
        <View style={Styles.optionsContainer}>
          <View style={Styles.choiceItemSectionHeader}>
            <Text style={DefaultStyles.primaryLabelFont}>
              {t('sides.message')}
            </Text>
            <Text>
              {minNumberOfSideDishes > 0 ? t('sides.minSidesMessage').replace('{minNumberOfSideDishes}', minNumberOfSideDishes) : ''}
              {' '}
              {maxNumberOfSideDishes > 0 ? t('sides.maxSidesMessage').replace('{maxNumberOfSideDishes}', maxNumberOfSideDishes) : ''}
            </Text>
            <ListItemSeparator />
          </View>
          <ChoiceItemPrices
            choiceItemPrices={otherChoiceItemPrices}
            minNumberOfChoiceItemPrices={minNumberOfSideDishes}
            maxNumberOfChoiceItemPrices={maxNumberOfSideDishes}
          />
        </View>
      )}
    </ScrollView>
    <View>
      <View style={Styles.quantityContainer}>
        <Text style={DefaultStyles.primaryLabelFont}>
          {t('quantity.label')}
        </Text>
        <QuantityControl value={quantity} onChange={onQuantityChanged} />
      </View>
      {isAddingOrder && <Button onPress={handleSubmit} title={t('addToOrder.button').replace('{quantity}', quantity)} disabled={!valid} />}
      {!isAddingOrder && <Button onPress={handleSubmit} title={t('updateOrder.button')} disabled={!valid} />}
    </View>
  </View>
);

MenuItemView.propTypes = {
  menuItemPrice: MenuItemPriceProp.isRequired,
  isAddingOrder: PropTypes.bool.isRequired,
  quantity: PropTypes.number.isRequired,
  onQuantityChanged: PropTypes.func.isRequired,
};

const mapStateToProps = (state, { menuItemPrice: { choiceItemPrices, defaultChoiceItemPrices }, dietaryOptions, sizes }) => {
  const typeFilterPredicate = (choiceItemPrice, items) =>
    !!choiceItemPrice.tags.find(tag => !!items.find(item => item.tag && item.tag.id.localeCompare(tag.id) === 0));
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
    : state.applicationState
      .getIn(['activeOrder', 'details'])
      .filter(item => item.get('groupId').localeCompare(activeOrderMenuItemPrice.get('groupId')) === 0)
      .first();
  const initialValues = {
    notes: activeOrderDetail ? activeOrderDetail.get('notes') : null,
    sizes: {},
  };

  if (activeOrderDetail) {
    activeOrderDetail.get('orderChoiceItemPrices').forEach(_ => {
      const id = _.getIn(['choiceItemPrice', 'id']);

      if (choiceItemPricesOfTypeSize.find(choiceItemPrice => choiceItemPrice.id.localeCompare(id) === 0)) {
        initialValues.sizes[id] = true;
      } else {
        initialValues[id] = true;
      }
    });
  } else {
    defaultChoiceItemPrices.forEach(_ => {
      const id = _.id;

      if (choiceItemPricesOfTypeSize.find(choiceItemPrice => choiceItemPrice.id.localeCompare(id) === 0)) {
        initialValues.sizes[id] = true;
      } else {
        initialValues[id] = true;
      }
    });
  }

  return {
    initialValues,
    choiceItemPricesOfTypeDietaryOption,
    choiceItemPricesOfTypeSize,
    otherChoiceItemPrices,
  };
};

export default connect(mapStateToProps)(reduxForm({ form: 'menuItem' })(translate()(MenuItemView)));
