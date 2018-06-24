// @flow

import React, { Component } from 'react';
import { Text } from 'react-native';
import { translate } from 'react-i18next';

class FilterCriteriaView extends Component {
  render = () => {
    /* const departmentCategoriesReport = this.props.departmentCategoriesReport;

       * const groupedByRootCategory = departmentCategoriesReport.groupBy(departmentCategory => departmentCategory);
       */
    return (
      <Text>
Test
      </Text>
    );
  };
}

FilterCriteriaView.propTypes = {};

export default translate()(FilterCriteriaView);
