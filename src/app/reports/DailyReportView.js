// @flow

import React, { Component } from 'react';
import { SectionList, Text, View } from 'react-native';
import { translate } from 'react-i18next';
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
      <Text style={[DefaultStyles.primaryLabelFont, Styles.departmentCategoryHeaderTitle]}>
        {name}
      </Text>
    </View>
  );

  renderDepartmentCategoryFooter = ({ section: { totalSale } }) => (
    <View style={Styles.departmentCategoryFooterSection}>
      <View style={Styles.departmentCategoryTotalPriceContainer}>
        <Text style={[DefaultStyles.primaryLabelFont, Styles.departmentCategoryFooterTitle]}>
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
        tag: { name },
      },
      totalSale,
    },
  }) => (
    <View key={id} style={Styles.departmentSubCategorySection}>
      <View style={Styles.departmentSubCategoryTitleContainer}>
        <Text style={[DefaultStyles.primaryLabelFont, Styles.departmentSubCategoryTitle]}>
          {name}
        </Text>
      </View>
      <View style={Styles.departmentSubCategoryTotalPriceContainer}>
        <Text style={[DefaultStyles.primaryLabelFont, Styles.departmentSubCategoryTitle]}>
          $
          {totalSale.toFixed(2)}
        </Text>
      </View>
    </View>
  );

  renderSeparator = () => <ListItemSeparator />;

  render = () => {
    const { departmentCategoriesReport } = this.props;
    const departmentCategoriesReportPopulatedWithSectionData = departmentCategoriesReport.map(
      ({ departmentCategory, totalSale, departmentSubCategoriesReport }) => ({
        departmentCategory,
        totalSale,
        data: departmentSubCategoriesReport,
      }),
    );

    return (
      <SectionList
        sections={departmentCategoriesReportPopulatedWithSectionData}
        renderSectionHeader={this.renderDepartmentCategoryHeader}
        renderSectionFooter={this.renderDepartmentCategoryFooter}
        renderItem={this.renderDepartmentSubCategoryHeader}
        ItemSeparatorComponent={this.renderSeparator}
        keyExtractor={this.keyExtractor}
      />
    );
  };
}

DailyReportView.propTypes = {};

export default translate()(DailyReportView);
