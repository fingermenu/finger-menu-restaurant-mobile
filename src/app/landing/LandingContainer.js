// @flow

import { Map } from 'immutable';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as asyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import LandingView from './LandingView';

class LandingContainer extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount = () => {
    this.props.asyncStorageActions.readValue(Map({ key: 'servingTableId' }));
    this.props.asyncStorageActions.readValue(Map({ key: 'servingTableName' }));
    this.props.asyncStorageActions.readValue(Map({ key: 'servingCustomerName' }));
    this.props.asyncStorageActions.readValue(Map({ key: 'servingCustomerNotes' }));
  };

  render = () => {
    return (
      <LandingView
        restaurantName={this.props.restaurantName}
        restaurantSubTitle={this.props.restaurantSubTitle}
        welcomeText={this.props.welcomeText}
        openingHourText={this.props.openingHourText}
        backgroundImageUrl={this.props.restaurantConfigurations.images.primaryLandingPageBackgroundImageUrl}
        navigateToMenu={this.props.navigateToMenu}
      />
    );
  };
}

LandingContainer.propTypes = {
  restaurantName: PropTypes.string.isRequired,
  restaurantSubTitle: PropTypes.string.isRequired,
  welcomeText: PropTypes.string.isRequired,
  openingHourText: PropTypes.string.isRequired,
  navigateToMenu: PropTypes.func.isRequired,
  backgroundImageUrl: PropTypes.string,
};

LandingContainer.defaultProps = {
  backgroundImageUrl: null,
};

function mapStateToProps(state) {
  return {
    restaurantName: state.asyncStorage.getIn(['keyValues', 'restaurantName']),
    restaurantSubTitle: 'Japanese Food & Bar',
    welcomeText: 'Traditional Japanese Food',
    openingHourText: 'Monday - Sunday\n11am - 2pm | 5pm - 10pm\n',
    restaurantConfigurations: JSON.parse(state.asyncStorage.getIn(['keyValues', 'restaurantConfigurations'])),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    asyncStorageActions: bindActionCreators(asyncStorageActions, dispatch),
    navigateToMenu: () =>
      dispatch(
        NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({
              routeName: 'Home',
            }),
          ],
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingContainer);
