// @flow

import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

import { TouchableItem } from '@microbusiness/common-react-native';
import Styles from './Styles';

class AddToOrderView extends Component {
  render = () => {
    return (
      <TouchableItem onPress={this.props.addToOrderPressed} style={Styles.container}>
        <Text style={Styles.text}>Add to order</Text>
      </TouchableItem>
    );
  };
}

AddToOrderView.propTypes = {
  addToOrderPressed: PropTypes.func.isRequired,
};

export default AddToOrderView;
