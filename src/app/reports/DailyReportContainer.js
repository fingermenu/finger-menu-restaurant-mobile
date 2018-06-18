// @flow

import { List, Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DailyReportView from './DailyReportView';

class DailyReportContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedLanguage: props.selectedLanguage, // eslint-disable-line react/no-unused-state
    };
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (nextProps.selectedLanguage.localeCompare(prevState.selectedLanguage) !== 0) {
      nextProps.relay.refetch(_ => _);

      return {
        selectedLanguage: nextProps.selectedLanguage,
      };
    }

    return null;
  };

  render = () => {
    const departmentCategoriesReport = List.of(
      Map({
        departmentCategory: Map({ tag: Map({ name: 'Parent Category 1' }) }),
        totalSale: 1.11,
        departmentSubCategoriesReport: List.of(
          Map({
            departmentCategory: Map({ tag: Map({ name: 'Sub Parent Category 1 - 1' }) }),
            totalSale: 11.22,
            departmentSubCategoriesReport: Map(),
          }),
        ),
      }),
      Map({
        departmentCategory: Map({ tag: Map({ name: 'Parent Category 2' }) }),
        totalSale: 2.1,
        departmentSubCategoriesReport: List.of(
          Map({
            departmentCategory: Map({ tag: Map({ name: 'Sub Parent Category 2 - 1' }) }),
            totalSale: 22.22,
            departmentSubCategoriesReport: Map(),
          }),
          Map({
            departmentCategory: Map({ tag: Map({ name: 'Sub Parent Category 2 - 1' }) }),
            totalSale: 13.44,
            departmentSubCategoriesReport: Map(),
          }),
        ),
      }),
      Map({
        departmentCategory: Map({ tag: Map({ name: 'Parent Category 3' }) }),
        totalSale: 3,
        departmentSubCategoriesReport: List.of(
          Map({
            departmentCategory: Map({ tag: Map({ name: 'Sub Parent Category 3 - 1' }) }),
            totalSale: 31.22,
            departmentSubCategoriesReport: Map(),
          }),
          Map({
            departmentCategory: Map({ tag: Map({ name: 'Sub Parent Category 3 - 2' }) }),
            totalSale: 32.33,
            departmentSubCategoriesReport: Map(),
          }),
          Map({
            departmentCategory: Map({ tag: Map({ name: 'Sub Parent Category 3 - 3' }) }),
            totalSale: 33.44,
            departmentSubCategoriesReport: Map(),
          }),
        ),
      }),
    );

    return <DailyReportView departmentCategoriesReport={departmentCategoriesReport.toJS()} />;
  };
}

DailyReportContainer.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  selectedLanguage: state.applicationState.get('selectedLanguage'),
});

export default connect(mapStateToProps)(DailyReportContainer);
