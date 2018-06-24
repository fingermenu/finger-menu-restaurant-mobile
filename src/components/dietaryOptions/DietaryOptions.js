// @flow

import Immutable from 'immutable';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { DietaryOptionsProp } from './PropTypes';
import DietaryOption from './DietaryOption';

class DietaryOptions extends Component {
  validateMustChooseDietaryOption = (_, values) => {
    const { mustChooseDietaryOption, dietaryOptions } = this.props;

    if (mustChooseDietaryOption) {
      const convertedValues = Immutable.fromJS(values);
      const dietaryOptionIds = convertedValues
        .keySeq()
        .filter(key => dietaryOptions.find(dietaryOption => dietaryOption.id.localeCompare(key) === 0));

      return dietaryOptionIds.find(id => convertedValues.get(id)) ? undefined : 'Dietry Option is required';
    }

    return undefined;
  };

  keyExtractor = item => item.id;

  renderItem = ({ item }) => <DietaryOption dietaryOption={item} validateMustChooseDietaryOption={this.validateMustChooseDietaryOption} />;

  render = () => {
    const { dietaryOptions } = this.props;

    return <FlatList data={dietaryOptions} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />;
  };
}

DietaryOptions.propTypes = {
  dietaryOptions: DietaryOptionsProp.isRequired,
  mustChooseDietaryOption: PropTypes.bool,
};

DietaryOptions.defaultProps = {
  mustChooseDietaryOption: false,
};

export default DietaryOptions;
