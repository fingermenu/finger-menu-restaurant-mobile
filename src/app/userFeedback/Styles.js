// @flow

import { StyleSheet } from 'react-native';
import { Color, Sizes } from '../../framework/style/DefaultStyles';

export default StyleSheet.create({
  container: {},
  topContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  feedbackIntroTextContainer: {
    width: 200,
    padding: 10,
  },
  feedbackIntroText: {
    fontSize: 16,
    fontWeight: '500',
    color: Color.primaryFontColor,
  },
  touchableContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  iconContainerStyle: {
    height: Sizes.searchBarHeaderHeight,
    width: Sizes.searchBarHeaderHeight,
  },
  feedbackOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: Color.primaryFontColor,
    padding: 10,
  },
  submitButtonContainer: {
    padding: 10,
  },
});
