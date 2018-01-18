// @flow

import { StyleSheet, Platform } from 'react-native';
import { Dimensions } from 'react-native';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT;
const DEFAULT_BANNER_COLOR = '#53A12C';
const DEFAULT_THEME_COLOR = '#649A59';
const DEFAULT_FONT_COLOR = '#333333';
const DEFAULT_FONT_COLOR_DISABLED = '#cccccc';
const DEFAULT_BACKGROUND_COLOR = '#EFF4F3';
const DEFAULT_BUTTON_COLOR = '#2891F2';
const DEFAULT_ICON_COLOR = '#283128';
const ICON_PRESS_COLOR = 'rgba(100,154,89, .32)';
const ACTION_BUTTON_COLOR = 'rgba(40,145,242, 1)';
const screen = Dimensions.get('window');

export const DefaultColor = {
  defaultBannerColor: DEFAULT_BANNER_COLOR,
  defaultThemeColor: DEFAULT_THEME_COLOR,
  defaultFontColor: DEFAULT_FONT_COLOR,
  defaultFontColorDisabled: DEFAULT_FONT_COLOR_DISABLED,
  defaultBackgroundColor: DEFAULT_BACKGROUND_COLOR,
  defaultButtonColor: DEFAULT_BUTTON_COLOR,
  iconColor: DEFAULT_ICON_COLOR,
  touchableIconPressColor: ICON_PRESS_COLOR,
  actionButtonColor: ACTION_BUTTON_COLOR,
  headerIconDefaultColor: 'white',
};

export const Sizes = {
  searchBarHeaderWidth: screen.width - 10,
  searchBarHeaderHeight: HEIGHT,
  screenWidth: screen.width,
  screenHeight: screen.height,
};

export const DefaultStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: HEIGHT,
  },
  primaryFont: {
    fontSize: 20,
    color: DEFAULT_FONT_COLOR,
  },
  primaryTitleFont: {
    fontSize: 26,
    color: DEFAULT_FONT_COLOR,
  },
  primaryLabelFont: {
    fontSize: 20,
    color: DEFAULT_FONT_COLOR,
  },
  iconContainerStyle: {
    height: 48,
    width: 48,
  },
});
