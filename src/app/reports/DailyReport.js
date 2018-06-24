// @flow

import * as googleAnalyticsTrackerActions from '@microbusiness/google-analytics-react-native/src/googleAnalyticsTracker/Actions';
import { ErrorMessageWithRetry, LoadingInProgress } from '@microbusiness/common-react-native';
import { Map } from 'immutable';
import React, { Component } from 'react';
import { graphql, QueryRenderer } from 'react-relay';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ChronoUnit, LocalDate, LocalTime, DateTimeFormatter, ZonedDateTime, ZoneId } from 'js-joda';
import { View } from 'react-native';
import { environment } from '../../framework/relay';
import { DefaultColor } from '../../style';
import DailyReportRelayContainer from './DailyReportRelayContainer';
import { HeaderContainer } from '../../components/header';
import * as applicationStateActions from '../../framework/applicationState/Actions';
import { screenNamePrefix } from '../../framework/AnalyticHelper';
import * as dailyReportActions from './Actions';
import FilterCriteriaView from './FilterCriteriaView';
import Styles from './Styles';

const dateTimeFormatter = DateTimeFormatter.ofPattern('dd-MM-yyyy');

class DailyReport extends Component {
  static navigationOptions = () => ({
    title: 'Daily Report',
    headerTitle: <HeaderContainer showOpenDrawerIcon />,
    headerTintColor: DefaultColor.headerIconDefaultColor,
    headerStyle: {
      backgroundColor: DefaultColor.defaultBannerColor,
    },
  });

  componentDidMount = () => {
    const { dailyReportActions, googleAnalyticsTrackerActions } = this.props;

    dailyReportActions.fromDateChanged(ZonedDateTime.now().truncatedTo(ChronoUnit.DAYS));
    dailyReportActions.toDateChanged(ZonedDateTime.now().truncatedTo(ChronoUnit.DAYS));
    googleAnalyticsTrackerActions.trackScreenView(Map({ screenName: `${screenNamePrefix}Daily Report` }));
  };

  handleFromDateChanged = date => {
    const from = ZonedDateTime.of(LocalDate.parse(date, dateTimeFormatter), LocalTime.MIDNIGHT, ZoneId.SYSTEM);
    const { to, dailyReportActions } = this.props;

    if (from.toLocalDate().isAfter(to.toLocalDate())) {
      dailyReportActions.toDateChanged(from);
    }

    dailyReportActions.fromDateChanged(from);
  };

  handleToDateChanged = date => {
    const { dailyReportActions } = this.props;

    dailyReportActions.toDateChanged(ZonedDateTime.of(LocalDate.parse(date, dateTimeFormatter), LocalTime.MIDNIGHT, ZoneId.SYSTEM));
  };

  addFilterCriteria = children => {
    const { from, to } = this.props;

    return (
      <View style={Styles.mainContainer}>
        <FilterCriteriaView
          dateFormat="DD-MM-YYYY"
          from={from}
          to={to}
          onFromDateChanged={this.handleFromDateChanged}
          onToDateChanged={this.handleToDateChanged}
        />
        <View style={Styles.resultContainer}>
          {children}
        </View>
      </View>
    );
  };

  renderRelayComponent = ({ error, props, retry }) => {
    if (error) {
      return this.addFilterCriteria(<ErrorMessageWithRetry errorMessage={error.message} onRetryPressed={retry} />);
    }

    if (props) {
      return this.addFilterCriteria(<DailyReportRelayContainer user={props.user} />);
    }

    return this.addFilterCriteria(<LoadingInProgress />);
  };

  render = () => {
    const { dateRange, restaurantId } = this.props;

    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query DailyReportQuery($restaurantId: ID!, $dateRange: DateRange!) {
            user {
              ...DailyReportRelayContainer_user
            }
          }
        `}
        variables={{
          restaurantId,
          dateRange,
        }}
        render={this.renderRelayComponent}
      />
    );
  };
}

DailyReport.propTypes = {
  applicationStateActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  googleAnalyticsTrackerActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  dailyReportActions: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  restaurantId: PropTypes.string.isRequired,
  dateRange: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  }).isRequired,
  from: PropTypes.instanceOf(ZonedDateTime).isRequired,
  to: PropTypes.instanceOf(ZonedDateTime).isRequired,
};

const mapStateToProps = state => ({
  restaurantId: state.applicationState.getIn(['activeRestaurant', 'id']),
  dateRange: {
    from: state.dailyReport.get('from').toString(),
    to: state.dailyReport
      .get('to')
      .plusDays(1)
      .plusSeconds(-1)
      .toString(),
  },
  from: state.dailyReport.get('from'),
  to: state.dailyReport.get('to'),
});

const mapDispatchToProps = dispatch => ({
  applicationStateActions: bindActionCreators(applicationStateActions, dispatch),
  googleAnalyticsTrackerActions: bindActionCreators(googleAnalyticsTrackerActions, dispatch),
  dailyReportActions: bindActionCreators(dailyReportActions, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(DailyReport));
