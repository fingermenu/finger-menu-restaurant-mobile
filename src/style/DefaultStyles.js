// @flow

import { Dimensions, Platform } from 'react-native';
import ScreenSize from './ScreenSizeHelper';

const screen = Dimensions.get('window');
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const HEIGHT = APPBAR_HEIGHT + STATUSBAR_HEIGHT;
const DEFAULT_BANNER_COLOR = '#3A3C3E';
const DEFAULT_THEME_COLOR = '#645953';
const DEFAULT_HOME_TAB_BACKGROUND_COLOR = '#FAFAFA';
const DEFAULT_FONT_COLOR = '#333333';
const DEFAULT_FONT_COLOR_DISABLED = '#cccccc';
const SECONDARY_FONT_COLOR = '#143936';
const DEFAULT_TOP_HEADER_FONT_COLOR = '#E4E5DF';
const DEFAULT_BACKGROUND_COLOR = '#E4E5DF';
const SECONDARY_BACKGROUND_COLOR = '#F2F2F2';
const PRIMARY_BACKGROUND_COLOR = '#24232D';
const DEFAULT_BUTTON_COLOR = '#2891F2';
const DEFAULT_ICON_COLOR = '#283128';
const ICON_PRESS_COLOR = 'rgba(100,154,89, .32)';
const ACTION_BUTTON_COLOR = 'rgba(40,145,242, 1)';

export const DefaultColor = {
  defaultBannerColor: DEFAULT_BANNER_COLOR,
  defaultThemeColor: DEFAULT_THEME_COLOR,
  defaultFontColor: DEFAULT_FONT_COLOR,
  defaultFontColorDisabled: DEFAULT_FONT_COLOR_DISABLED,
  defaultTopHeaderFontColor: DEFAULT_TOP_HEADER_FONT_COLOR,
  defaultBackgroundColor: DEFAULT_BACKGROUND_COLOR,
  defaultHomeTabBackgroundColor: DEFAULT_HOME_TAB_BACKGROUND_COLOR,
  secondaryBackgroundColor: SECONDARY_BACKGROUND_COLOR,
  secondaryFontColor: SECONDARY_FONT_COLOR,
  defaultButtonColor: DEFAULT_BUTTON_COLOR,
  iconColor: DEFAULT_ICON_COLOR,
  touchableIconPressColor: ICON_PRESS_COLOR,
  actionButtonColor: ACTION_BUTTON_COLOR,
  headerIconDefaultColor: 'white',
  primaryBackgroundColor: PRIMARY_BACKGROUND_COLOR,
};

export const Sizes = {
  headerWidth: screen.width - 10,
  headerHeight: HEIGHT,
  screenWidth: screen.width,
  screenHeight: screen.height,
  fontSize: ScreenSize({ s: 14, l: 18, xl: 20 }, 16),
  iconHeight: ScreenSize({ s: 36, l: 40, xl: 46 }, 32),
  iconWidth: ScreenSize({ s: 36, l: 46, xl: 46 }, 32),
};

export const DefaultStyles = {
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
    fontSize: Sizes.fontSize,
    color: DEFAULT_FONT_COLOR,
  },
  primaryTitleFont: {
    fontSize: Sizes.fontSize + 4,
    color: DEFAULT_FONT_COLOR,
  },
  primaryLabelFont: {
    fontSize: Sizes.fontSize + 2,
    color: DEFAULT_FONT_COLOR,
  },
  iconContainerStyle: {
    height: Sizes.iconHeight,
    width: Sizes.iconWidth,
  },
};

export const getScreenSizes = () => {
  const screen = Dimensions.get('window');

  return {
    width: screen.width,
    height: screen.height,
  };
};

export const getPopupDialogSizes = () => {
  const screenSizes = getScreenSizes();

  return {
    height: screenSizes.screenHeight / 2,
    width: screenSizes.screenWidth - 10,
  };
};
