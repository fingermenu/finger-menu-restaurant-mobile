// @flow

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
    const {
      user: {
        restaurant: { departmentCategoriesReport },
      },
    } = this.props;

    return <DailyReportView departmentCategoriesReport={departmentCategoriesReport} />;
  };
}

DailyReportContainer.propTypes = {
  selectedLanguage: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  selectedLanguage: state.applicationState.get('selectedLanguage'),
});

export default connect(mapStateToProps)(DailyReportContainer);
