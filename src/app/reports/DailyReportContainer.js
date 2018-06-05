// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { convert } from 'js-joda';
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
    const { from, to } = this.props;

    return <DailyReportView from={from} to={to} />;
  };
}

DailyReportContainer.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
  from: PropTypes.instanceOf(Date).isRequired,
  to: PropTypes.instanceOf(Date).isRequired,
};

const mapStateToProps = state => ({
  selectedLanguage: state.applicationState.get('selectedLanguage'),
  from: convert(state.dailyReport.get('from')).toDate(),
  to: convert(state.dailyReport.get('to')).toDate(),
});

export default connect(mapStateToProps)(DailyReportContainer);
