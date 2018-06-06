// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LocalDate, LocalTime, DateTimeFormatter, ZonedDateTime, ZoneId } from 'js-joda';
import DailyReportView from './DailyReportView';
import * as dailyReportActions from './Actions';

const dateTimeFormatter = DateTimeFormatter.ofPattern('dd-MM-yyyy');

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

  handleFromDateChanged = date => {
    const from = ZonedDateTime.of(LocalDate.parse(date, dateTimeFormatter), LocalTime.MIDNIGHT, ZoneId.SYSTEM);

    if (from.toLocalDate().isAfter(this.props.to.toLocalDate())) {
      this.props.dailyReportActions.toDateChanged(from);
    }

    this.props.dailyReportActions.fromDateChanged(from);
  };

  handleToDateChanged = date => {
    this.props.dailyReportActions.toDateChanged(ZonedDateTime.of(LocalDate.parse(date, dateTimeFormatter), LocalTime.MIDNIGHT, ZoneId.SYSTEM));
  };

  render = () => {
    const { from, to } = this.props;

    return (
      <DailyReportView
        dateFormat="DD-MM-YYYY"
        from={from}
        to={to}
        onFromDateChanged={this.handleFromDateChanged}
        onToDateChanged={this.handleToDateChanged}
      />
    );
  };
}

DailyReportContainer.propTypes = {
  dailyReportActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  selectedLanguage: PropTypes.string.isRequired,
  from: PropTypes.instanceOf(ZonedDateTime).isRequired,
  to: PropTypes.instanceOf(ZonedDateTime).isRequired,
};

const mapStateToProps = state => ({
  selectedLanguage: state.applicationState.get('selectedLanguage'),
  from: state.dailyReport.get('from'),
  to: state.dailyReport.get('to'),
});

const mapDispatchToProps = dispatch => ({
  dailyReportActions: bindActionCreators(dailyReportActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DailyReportContainer);
