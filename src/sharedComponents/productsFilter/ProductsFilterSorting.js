// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Styles from './Styles';

class ProductsFilterSorting extends Component {
  renderPriceLowToHigh = () => (
    <View style={Styles.sortingOption}>
      <Icon size={15} name="sort-amount-asc" type="font-awesome" />
      <Text style={Styles.sortingOptionText}>Price Lowest</Text>
    </View>
  );

  renderPriceHighToLow = () => (
    <View style={Styles.sortingOption}>
      <Icon size={15} name="sort-amount-desc" type="font-awesome" />
      <Text style={Styles.sortingOptionText}>Price Highest</Text>
    </View>
  );

  renderSavingLowToHigh = () => (
    <View style={Styles.sortingOption}>
      <Icon size={15} name="sort-amount-asc" type="font-awesome" />
      <Text style={Styles.sortingOptionText}>Saving $ Smallest</Text>
    </View>
  );

  renderSavingHighToLow = () => (
    <View style={Styles.sortingOption}>
      <Icon size={15} name="sort-amount-desc" type="font-awesome" />
      <Text style={Styles.sortingOptionText}>Saving $ Highest</Text>
    </View>
  );

  renderSavingPercentageLowToHigh = () => (
    <View style={Styles.sortingOption}>
      <Icon size={15} name="sort-amount-asc" type="font-awesome" />
      <Text style={Styles.sortingOptionText}>Saving % Smallest</Text>
    </View>
  );

  renderSavingPercentageHighToLow = () => (
    <View style={Styles.sortingOption}>
      <Icon size={15} name="sort-amount-desc" type="font-awesome" />
      <Text style={Styles.sortingOptionText}>Saving % Biggest</Text>
    </View>
  );

  renderNameAscending = () => (
    <View style={Styles.sortingOption}>
      <Icon size={15} name="sort-alpha-asc" type="font-awesome" />
      <Text style={Styles.sortingOptionText}>Title Ascending</Text>
    </View>
  );

  renderNameDescending = () => (
    <View style={Styles.sortingOption}>
      <Icon size={15} name="sort-alpha-desc" type="font-awesome" />
      <Text style={Styles.sortingOptionText}>Title Descending</Text>
    </View>
  );

  render() {
    let renderSelectedSortOption = this.renderNameAscending;

    switch (this.props.sortOption) {
      case 'NameAscending':
        renderSelectedSortOption = this.renderNameAscending;

        break;

      case 'NameDescending':
        renderSelectedSortOption = this.renderNameDescending;

        break;

      case 'PriceAscending':
        renderSelectedSortOption = this.renderPriceLowToHigh;

        break;

      case 'PriceDescending':
        renderSelectedSortOption = this.renderPriceHighToLow;

        break;

      case 'SavingAscending':
        renderSelectedSortOption = this.renderSavingLowToHigh;

        break;

      case 'SavingDescending':
        renderSelectedSortOption = this.renderSavingHighToLow;

        break;

      case 'SavingPercentageAscending':
        renderSelectedSortOption = this.renderSavingPercentageLowToHigh;

        break;

      case 'SavingPercentageDescending':
        renderSelectedSortOption = this.renderSavingPercentageHighToLow;

        break;

      default:
        renderSelectedSortOption = this.renderNameDescending;

        break;
    }
    return (
      <View>
        <Menu>
          <MenuTrigger>
            <View style={Styles.selectedSortOption}>{renderSelectedSortOption()}</View>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => this.props.onSortOptionChanged('PriceAscending')}>{this.renderPriceLowToHigh()}</MenuOption>
            <MenuOption onSelect={() => this.props.onSortOptionChanged('PriceDescending')}>{this.renderPriceHighToLow()}</MenuOption>
            <MenuOption onSelect={() => this.props.onSortOptionChanged('SavingAscending')}>{this.renderSavingLowToHigh()}</MenuOption>
            <MenuOption onSelect={() => this.props.onSortOptionChanged('SavingDescending')}>{this.renderSavingHighToLow()}</MenuOption>
            <MenuOption onSelect={() => this.props.onSortOptionChanged('SavingPercentageAscending')}>
              {this.renderSavingPercentageLowToHigh()}
            </MenuOption>
            <MenuOption onSelect={() => this.props.onSortOptionChanged('SavingPercentageDescending')}>
              {this.renderSavingPercentageHighToLow()}
            </MenuOption>
            <MenuOption onSelect={() => this.props.onSortOptionChanged('NameAscending')}>{this.renderNameAscending()}</MenuOption>
            <MenuOption onSelect={() => this.props.onSortOptionChanged('NameDescending')}>{this.renderNameDescending()}</MenuOption>
          </MenuOptions>
        </Menu>
      </View>
    );
  }
}

ProductsFilterSorting.propTypes = {
  onSortOptionChanged: PropTypes.func.isRequired,
  sortOption: PropTypes.string.isRequired,
};

export default ProductsFilterSorting;
