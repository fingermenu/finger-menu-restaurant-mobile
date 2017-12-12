// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FlyerDetail from './FlyerDetail';
import { GetFlyers } from '../flyers/FlyersData';

class FlyerContainer extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params ? navigation.state.params.title : '',
  });

  render = () => {
    return <FlyerDetail slides={this.props.slides} name={this.props.name} expiryDate={this.props.expiryDate} />;
  };
}

FlyerContainer.propTypes = {
  storeName: PropTypes.string.isRequired,
  expiryDate: PropTypes.string.isRequired,
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      uri: PropTypes.string,
    }),
  ).isRequired,
};

function mapStateToProps(state, props) {
  const storeId = props.navigation.state.params.id;
  const allFlyers = GetFlyers();

  return allFlyers.find(_ => _.id === storeId);
}

export default connect(mapStateToProps)(FlyerContainer);
