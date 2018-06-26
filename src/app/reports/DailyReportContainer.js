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
        departmentCategory: Map({ id: 'id1', tag: Map({ name: 'Parent Category 1' }) }),
        totalSale: 1.11,
        departmentSubCategoriesReport: List.of(
          Map({
            departmentCategory: Map({ id: 'id1-1', tag: Map({ name: 'Sub Category 1 - 1' }) }),
            totalSale: 11.22,
          }),
        ),
      }),
      Map({
        departmentCategory: Map({ id: 'id2', tag: Map({ name: 'Parent Category 2' }) }),
        totalSale: 2.1,
        departmentSubCategoriesReport: List.of(
          Map({
            departmentCategory: Map({ id: 'id2-1', tag: Map({ name: 'Sub Category 2 - 1' }) }),
            totalSale: 22.22,
          }),
          Map({
            departmentCategory: Map({ id: 'id2-2', tag: Map({ name: 'Sub Category 2 - 1' }) }),
            totalSale: 13.44,
          }),
        ),
      }),
      Map({
        departmentCategory: Map({ id: 'id3', tag: Map({ name: 'Parent Category 3' }) }),
        totalSale: 3,
        departmentSubCategoriesReport: List.of(
          Map({
            departmentCategory: Map({ id: 'id3-1', tag: Map({ name: 'Sub Category 3 - 1' }) }),
            totalSale: 31.22,
          }),
          Map({
            departmentCategory: Map({ id: 'id3-2', tag: Map({ name: 'Sub Category 3 - 2' }) }),
            totalSale: 32.33,
          }),
          Map({
            departmentCategory: Map({ id: 'id3-3', tag: Map({ name: 'Sub Category 3 - 3' }) }),
            totalSale: 33.44,
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
