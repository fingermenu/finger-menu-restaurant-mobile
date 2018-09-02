// @flow

import * as escPosPrinterActions from '@microbusiness/printer-react-native/src/escPosPrinter/Actions';
import { Map } from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ZonedDateTime } from 'js-joda';
import DailyReportView from './DailyReportView';
import PrinterHelper from '../../framework/PrintHelper';

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

  handlePrint = () => {
    const {
      user: {
        restaurant: { departmentCategoriesRootReport },
      },
      departmentCategoryDailyReportTemplate,
      printerConfig: { hostname, port, maxLineWidth },
      escPosPrinterActions,
      from,
      to,
    } = this.props;
    const { selectedLanguage } = this.state;
    const documentContent = PrinterHelper.convertDepartmentCategoriesReportIntoPrintableDocument(
      departmentCategoriesRootReport,
      departmentCategoryDailyReportTemplate,
      from,
      to,
      maxLineWidth,
    );

    escPosPrinterActions.printDocument(
      Map({
        hostname,
        port,
        documentContent,
        numberOfCopies: 1,
        language: selectedLanguage,
      }),
    );
  };

  render = () => {
    const {
      user: {
        restaurant: { departmentCategoriesRootReport },
      },
      departmentCategoryDailyReportTemplate,
      printerConfig,
    } = this.props;

    return (
      <DailyReportView
        departmentCategoriesRootReport={departmentCategoriesRootReport}
        canPrint={!!departmentCategoryDailyReportTemplate && !!printerConfig}
        onPrintPressed={this.handlePrint}
      />
    );
  };
}

DailyReportContainer.propTypes = {
  escPosPrinterActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  selectedLanguage: PropTypes.string.isRequired,
  from: PropTypes.instanceOf(ZonedDateTime).isRequired,
  to: PropTypes.instanceOf(ZonedDateTime).isRequired,
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
    .find(documentTemplate => documentTemplate.get('name').localeCompare('DepartmentCategoryDailyReport') === 0);

  return {
    selectedLanguage: state.applicationState.get('selectedLanguage'),
    printerConfig,
    departmentCategoryDailyReportTemplate: departmentCategoryDailyReportTemplate ? departmentCategoryDailyReportTemplate.get('template') : null,
    from: state.dailyReport.get('from'),
    to: state.dailyReport.get('to'),
  };
};

const mapDispatchToProps = dispatch => ({
  escPosPrinterActions: bindActionCreators(escPosPrinterActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DailyReportContainer);
