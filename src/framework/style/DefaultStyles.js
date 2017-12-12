// @flow

import { StyleSheet, Platform } from 'react-native';
import { Dimensions } from 'react-native';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT;
const PRIMARY_COLOR_NORMAL = '#53A12C';
const PRIMARY_COLOR_DARK = '#649A59';
const PRIMARY_COLOR_LIGHT = '#A6D891';
const PRIMARY_FONT_COLOR = '#333333';
const PRIMARY_FONT_COLOR_DISABLED = '#cccccc';
const PRIMARY_BACKGROUND_COLOR = '#EFF4F3';
const SECONDARY_COLOR_ACTION = '#2891F2';
const ICON_PRESS_COLOR = 'rgba(100,154,89, .32)';
const ACTION_BUTTON_COLOR = 'rgba(40,145,242, 1)';
const screen = Dimensions.get('window');

export const Color = {
  primaryColorNormal: PRIMARY_COLOR_NORMAL,
  primaryColorDark: PRIMARY_COLOR_DARK,
  primaryColorLight: PRIMARY_COLOR_LIGHT,
  primaryFontColor: PRIMARY_FONT_COLOR,
  primaryFontColorDisabled: PRIMARY_FONT_COLOR_DISABLED,
  primaryBackgroundColor: PRIMARY_BACKGROUND_COLOR,
  secondaryColorAction: SECONDARY_COLOR_ACTION,
  touchableIconPressColor: ICON_PRESS_COLOR,
  actionButtonColor: ACTION_BUTTON_COLOR,
  headerIconDefaultColor: 'white',
};

export const Sizes = {
  searchBarHeaderWidth: screen.width - 10,
  searchBarHeaderHeight: HEIGHT,
  screenWidth: screen.width,
};

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEIGHT,
  },
  primaryFont: {
    fontSize: 14,
    color: PRIMARY_FONT_COLOR,
  },
});
