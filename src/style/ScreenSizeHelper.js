// @flow

import { Dimensions } from 'react-native';

// Height
const screenSizes = [
  {
    name: 'xs',
    height: 568,
  },
  {
    name: 's',
    height: 667,
  },
  {
    name: 'l',
    height: 768,
  },
  {
    name: 'xl',
    height: 1024,
  },
];

const ScreenSize = (screenSizeOptions, defaultValue) => {
  const matchedScreenSizes = screenSizes.filter(screenSize => {
    return Dimensions.get('window').height <= screenSize.height;
  });

  let value;
  const hasScreenSizeOption = matchedScreenSizes.some(matchedScreenSize => {
    if (screenSizeOptions.hasOwnProperty(matchedScreenSize.name)) {
      value = screenSizeOptions[matchedScreenSize.name];
      return true;
    } else {
      return false;
    }
  });
  if (!hasScreenSizeOption) {
    value = defaultValue;
  }
  return value;
};

// Example usage:
// screenSize({xs: 8, s: 12}, 16)
// screenSize({s: 12}, 16)
// screenSize({xs: 8}, 16)
export default ScreenSize;
