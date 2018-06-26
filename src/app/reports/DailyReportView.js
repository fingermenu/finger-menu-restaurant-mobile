// @flow

import React, { Component } from 'react';
import { SectionList, Text } from 'react-native';
import { translate } from 'react-i18next';

class DailyReportView extends Component {
  renderDepartmentCategoryHeader = ({
    section: {
      departmentCategory: {
        tag: { name },
      },
    },
  }) => {
    return (
      <Text style={{ fontWeight: 'bold' }}>
        {name}
      </Text>
    );
  };

  renderDepartmentSubCategoryHeader = ({
    item: {
      departmentCategory: {
        id,
        tag: { name },
      },
    },
  }) => (
    <Text key={id}>
      {name}
    </Text>
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
      />
    );
  };
}

DailyReportView.propTypes = {};

export default translate()(DailyReportView);
