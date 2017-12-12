// @flow

import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import Flyers from './Flyers';
import { GetFlyers } from './FlyersData';
import { Color } from '../../../framework/style/DefaultStyles';
import { MainMenuContainer } from '../../../sharedComponents/mainMenu';

class FlyersContainer extends Component {
  static navigationOptions = {
    tabBarLabel: 'Flyers',
    tabBarIcon: ({ tintColor, focused }) => <Icon name={focused ? 'ios-images' : 'ios-images-outline'} type="ionicon" size={26} color={tintColor} />,
    headerLeft: <MainMenuContainer />,
    title: 'Flyers',
    headerStyle: {
      backgroundColor: Color.primaryColorNormal,
    },
    headerTintColor: Color.headerIconDefaultColor,
    // headerTitleStyle: {
    //   marginLeft: Platform.OS === 'ios' ? null : 70,
    // },
    headerBackTitle: null,
  };
  onFlyerListItemPress = (id, name) => {
    this.props.gotoFlyer(id, name);
  };

  render = () => {
    return <Flyers flyers={this.props.flyers} onFlyerListItemPress={this.onFlyerListItemPress} />;
  };
}

FlyersContainer.propTypes = {
  gotoFlyer: PropTypes.func.isRequired,
  flyers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      storeName: PropTypes.string.isRequired,
      storeDisplayName: PropTypes.string.isRequired,
      thumbnailImageUrl: PropTypes.string,
      expiryDate: PropTypes.string,
    }),
  ).isRequired,
};

function mapStateToProps() {
  return {
    flyers: GetFlyers(),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    gotoFlyer: (id, name) =>
      dispatch(
        NavigationActions.navigate({
          routeName: 'Flyer',
          params: {
            id,
            title: name,
          },
        }),
      ),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FlyersContainer);
