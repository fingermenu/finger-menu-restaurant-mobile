// @flow

import * as escPosPrinterActions from '@microbusiness/printer-react-native/src/escPosPrinter/Actions';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
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

  handlePrint = () => {};

  render = () => {
    const {
      user: {
        restaurant: { departmentCategoriesReport },
      },
      departmentCategoryDailyReportTemplate,
      printerConfig,
    } = this.props;

    return (
      <DailyReportView
        departmentCategoriesReport={departmentCategoriesReport}
        canPrint={departmentCategoryDailyReportTemplate && printerConfig}
        onPrintPressed={this.handlePrint}
      />
    );
  };
}

DailyReportContainer.propTypes = {
  escPosPrinterActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  selectedLanguage: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  const configurations = state.applicationState.getIn(['activeRestaurant', 'configurations']);
  const printerConfig = configurations.get('printers').isEmpty()
    ? null
    : configurations
      .get('printers')
      .first()
      .toJS();
  const departmentCategoryDailyReportTemplate = configurations
    .get('documentTemplates')
    .find(documentTemplate => documentTemplate.get('name').localeCompare('departmentCategoryDailyReport') === 0);

  return {
    selectedLanguage: state.applicationState.get('selectedLanguage'),
    printerConfig,
    departmentCategoryDailyReportTemplate: departmentCategoryDailyReportTemplate ? departmentCategoryDailyReportTemplate.get('template') : null,
  };
};

const mapDispatchToProps = dispatch => ({
  escPosPrinterActions: bindActionCreators(escPosPrinterActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DailyReportContainer);
