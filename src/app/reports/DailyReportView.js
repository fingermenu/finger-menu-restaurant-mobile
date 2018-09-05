// @flow

import React, { Component } from 'react';
import { SectionList, Text, View, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import pad from 'pad';
import { DefaultStyles } from '../../style';
import Styles from './Styles';
import { ListItemSeparator } from '../../components/list';

class DailyReportView extends Component {
  keyExtractor = ({ departmentCategory: { id } }) => id;

  renderDepartmentCategoryHeader = ({
    section: {
      departmentCategory: {
        tag: { name },
      },
    },
  }) => (
    <View style={Styles.departmentCategoryHeaderSection}>
      <Text style={[DefaultStyles.primaryLabelFont, Styles.departmentCategoryHeaderTitle]}>{name}</Text>
    </View>
  );

  renderDepartmentCategoryFooter = ({ section: { totalSale, quantity } }) => (
    <View style={Styles.departmentCategoryFooterSection}>
      <View style={Styles.departmentCategoryTitleContainer}>
        <Text style={[DefaultStyles.primaryLabelFont, Styles.titleContainer]}>Total</Text>
      </View>
      <View style={Styles.departmentCategoryQuantityContainer}>
        <Text style={[DefaultStyles.primaryLabelFont, Styles.departmentCategoryFooterQuantity]}>{quantity}</Text>
      </View>
      <View style={Styles.departmentCategoryTotalSaleContainer}>
        <Text style={[DefaultStyles.primaryLabelFont, Styles.departmentCategoryFooterTotalSale]}>
$
          {totalSale.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  renderDepartmentSubCategoryHeader = ({
    item: {
      departmentCategory: {
        id,
        tag: { key, name },
      },
      totalSale,
      quantity,
    },
  }) => (
    <View key={id} style={Styles.departmentSubCategorySection}>
      <View style={Styles.departmentSubCategoryTitleContainer}>
        <Text style={[DefaultStyles.primaryLabelFont, Styles.departmentSubCategoryTitle]}>{pad(key ? key : '', 5) + ' ' + name}</Text>
      </View>
      <View style={Styles.departmentSubCategoryQuantityContainer}>
        <Text style={[DefaultStyles.primaryLabelFont, Styles.departmentSubCategoryQuantity]}>{quantity}</Text>
      </View>
      <View style={Styles.departmentSubCategoryTotalSaleContainer}>
        <Text style={[DefaultStyles.primaryLabelFont, Styles.departmentSubCategoryTotalSale]}>
$
          {totalSale.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  renderSeparator = () => <ListItemSeparator />;

  render = () => {
    const {
      t,
      departmentCategoriesRootReport: { departmentCategoriesReport, eftpos, cash, totalSale, quantity },
      canPrint,
      onPrintPressed,
    } = this.props;
    const departmentCategoriesReportPopulatedWithSectionData = departmentCategoriesReport.map(
      ({ departmentCategory, totalSale, quantity, departmentSubCategoriesReport }) => ({
        departmentCategory,
        totalSale,
        quantity,
        data: departmentSubCategoriesReport,
      }),
    );

    return (
      <ScrollView>
        <SectionList
          sections={departmentCategoriesReportPopulatedWithSectionData}
          renderSectionHeader={this.renderDepartmentCategoryHeader}
          renderSectionFooter={this.renderDepartmentCategoryFooter}
          renderItem={this.renderDepartmentSubCategoryHeader}
          ItemSeparatorComponent={this.renderSeparator}
          keyExtractor={this.keyExtractor}
        />
        <View style={Styles.departmentCategoryTotalFooterSection}>
          <View style={Styles.departmentCategoryTotalTitleContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.titleContainer]}>Grand Total</Text>
          </View>
          <View style={Styles.departmentCategoryGrandQuantityContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.departmentCategoryFooterGrandQuantity]}>{quantity}</Text>
          </View>
          <View style={Styles.departmentCategoryGrandTotalSaleContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.departmentCategoryFooterGrandTotalSale]}>
$
              {totalSale.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={Styles.discountSection}>
          <View style={Styles.discountTitleContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.discountTitle]}>Discount</Text>
          </View>
          <View style={Styles.discountContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.discount]}>
              -$
              {(totalSale - eftpos - cash).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={Styles.eftposSection}>
          <View style={Styles.eftposTitleContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.eftposTitle]}>Eftpos</Text>
          </View>
          <View style={Styles.eftposContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.eftpos]}>
$
              {eftpos.toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={Styles.cashSection}>
          <View style={Styles.cashTitleContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.cashTitle]}>Cash</Text>
          </View>
          <View style={Styles.cashContainer}>
            <Text style={[DefaultStyles.primaryLabelFont, Styles.cash]}>
$
              {cash.toFixed(2)}
            </Text>
          </View>
        </View>
        {canPrint && <Button onPress={onPrintPressed} title={t('print.button')} />}
      </ScrollView>
    );
  };
}

DailyReportView.propTypes = {
  onPrintPressed: PropTypes.func.isRequired,
  canPrint: PropTypes.bool.isRequired,
};

export default translate()(DailyReportView);
