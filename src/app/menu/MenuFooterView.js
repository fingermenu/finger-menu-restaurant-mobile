// @flow

import { TouchableItem } from '@microbusiness/common-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Styles from './Styles';

const MenuFooterView = ({ t, onViewOrderPressed, totalOrderQuantity }) => (
  <TouchableItem onPress={onViewOrderPressed} style={Styles.footerContainer}>
    <View style={Styles.footerTextContainer}>
      <Text style={Styles.footerText}>
        {t('viewOrder.label')}
      </Text>
      <Text style={Styles.footerText}>
        {t('numberOfItems.label').replace('{numberOfItems}', totalOrderQuantity)}
      </Text>
    </View>
  </TouchableItem>
);

MenuFooterView.propTypes = {
  onViewOrderPressed: PropTypes.func.isRequired,
  totalOrderQuantity: PropTypes.number.isRequired,
};

export default translate()(MenuFooterView);
