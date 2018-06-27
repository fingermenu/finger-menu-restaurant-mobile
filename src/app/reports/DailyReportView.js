// @flow

import React, { Component } from 'react';
import { SectionList, Text, View } from 'react-native';
import { translate } from 'react-i18next';
import { DefaultStyles } from '../../style';
import Styles from './Styles';

class DailyReportView extends Component {
  keyExtractor = ({ departmentCategory: { id } }) => id;

  renderDepartmentCategoryHeader = ({
    section: {
      departmentCategory: {
        tag: { name },
      },
    },
  }) => (
    <View style={Styles.departmentCategorySection}>
      <Text style={[DefaultStyles.primaryLabelFont, Styles.departmentCategoryTitle]}>
        {name}
      </Text>
    </View>
  );

  renderDepartmentSubCategoryHeader = ({
    item: {
      departmentCategory: {
        id,
        tag: { name },
      },
    },
  }) => (
    <View key={id} style={Styles.departmentSubCategorySection}>
      <Text style={[DefaultStyles.primaryLabelFont, Styles.departmentSubCategoryTitle]}>
        {name}
      </Text>
    </View>
  );

  render = () => {
    const { departmentCategoriesReport } = this.props;
    const departmentCategoriesReportPopulatedWithSectionData = departmentCategoriesReport.map(
      ({ departmentCategory, departmentSubCategoriesReport }) => ({
        departmentCategory,
        data: departmentSubCategoriesReport,
      }),
    );

    return (
      <SectionList
        sections={departmentCategoriesReportPopulatedWithSectionData}
        renderSectionHeader={this.renderDepartmentCategoryHeader}
        renderItem={this.renderDepartmentSubCategoryHeader}
        keyExtractor={this.keyExtractor}
      />
    );
  };
}

DailyReportView.propTypes = {};

export default translate()(DailyReportView);
