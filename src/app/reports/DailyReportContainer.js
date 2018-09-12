// @flow

import * as escPosPrinterActions from '@microbusiness/printer-react-native/src/escPosPrinter/Actions';
import { Map, Range } from 'immutable';
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
      printers,
      departmentCategoryDailyReportTemplate,
      escPosPrinterActions,
      from,
      to,
    } = this.props;

    if (!departmentCategoryDailyReportTemplate) {
      return null;
    }

    const documents = departmentCategoryDailyReportTemplate
      .get('linkedPrinters')
      .flatMap(linkedPrinter => {
        const foundPrinter = printers.find(({ name }) => name.localeCompare(linkedPrinter.get('name')) === 0);

        if (!foundPrinter) {
          return null;
        }

        const content = PrinterHelper.convertDepartmentCategoriesReportIntoPrintableDocument(
          departmentCategoriesRootReport,
          departmentCategoryDailyReportTemplate.get('template'),
          from,
          to,
          Math.floor(foundPrinter.maxLineWidth / departmentCategoryDailyReportTemplate.get('maxLineWidthDivisionFactor')),
        );

        return Range(0, linkedPrinter.get('numberOfPrints')).map(() => Map({ hostname: foundPrinter.hostname, port: foundPrinter.port, content }));
      })
      .filter(_ => _)
      .toList();

    if (documents.isEmpty()) {
      return;
    }

    escPosPrinterActions.printDocument(Map({ documents }));
  };

  render = () => {
    const {
      user: {
        restaurant: { departmentCategoriesRootReport },
      },
      departmentCategoryDailyReportTemplate,
    } = this.props;

    return (
      <DailyReportView
        departmentCategoriesRootReport={departmentCategoriesRootReport}
        canPrint={!!departmentCategoryDailyReportTemplate}
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
  const printers = configurations.get('printers').toJS();
  const departmentCategoryDailyReportTemplate = configurations
    .get('documentTemplates')
    .find(documentTemplate => documentTemplate.get('name').localeCompare('DepartmentCategoryDailyReport') === 0);

  return {
    selectedLanguage: state.applicationState.get('selectedLanguage'),
    printers,
    departmentCategoryDailyReportTemplate,
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
