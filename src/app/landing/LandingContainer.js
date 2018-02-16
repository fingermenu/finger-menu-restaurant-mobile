// @flow

import { Map } from 'immutable';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as AsyncStorageActions from '@microbusiness/common-react/src/asyncStorage/Actions';
import LandingView from './LandingView';

class LandingContainer extends Component {
  static navigationOptions = {
    header: null,
  };

  componentWillMount = () => {
    this.props.AsyncStorageActions.readValue(Map({ key: 'servingTableId' }));
    this.props.AsyncStorageActions.readValue(Map({ key: 'servingTableName' }));
    this.props.AsyncStorageActions.readValue(Map({ key: 'servingCustomerName' }));
    this.props.AsyncStorageActions.readValue(Map({ key: 'servingCustomerNotes' }));
  };

  render = () => {
    return (
      <LandingView
        restaurantName={this.props.restaurantName}
        restaurantSubTitle={this.props.restaurantSubTitle}
        welcomeText={this.props.welcomeText}
        openingHourText={this.props.openingHourText}
        backgroundImageUrl={this.props.backgroundImageUrl}
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
  backgroundImageUrl: PropTypes.string.isRequired,
  navigateToMenu: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    restaurantName: state.asyncStorage.getIn(['keyValues', 'restaurantName']),
    restaurantSubTitle: 'Japanese Food & Bar',
    welcomeText: 'Traditional Japanese Food',
    openingHourText: 'Monday - Sunday\n11am - 2pm | 5pm - 10pm\n',
    backgroundImageUrl:
      'https://firebasestorage.googleapis.com/v0/b/firstproject-b2fb1.appspot.com/o/restaurants%2Ftakumi%2Fcover.jpg?alt=media&token=0a3f9bc2-1d2d-48c4-9f32-8b2207c1c76b',
  };
}

function mapDispatchToProps(dispatch) {
  return {
    AsyncStorageActions: bindActionCreators(AsyncStorageActions, dispatch),
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
