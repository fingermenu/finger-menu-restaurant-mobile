// @flow

import React from 'react';
import { View } from 'react-native';
import { Tile } from 'react-native-elements';

const RecommendMenuItem = ({ menuItem, onViewMenuItemPressed }) => (
  <View>
    <Tile
      onPress={onViewMenuItemPressed}
      imageSrc={{ uri: menuItem.imageUrl }}
      title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores dolore exercitationem"
      featured
      caption="Some Caption Text"
    />
  </View>
);

export default RecommendMenuItem;
