// @flow

import { StyleSheet } from 'react-native';
import { DefaultColor, Sizes } from '../../style';

export default StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: Sizes.screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
  },
  welcomeText: {
    fontWeight: 'bold',
    fontSize: 36,
    color: 'white',
  },
  restaurantName: {
    fontWeight: 'bold',
    fontSize: 36,
    color: 'white',
  },
  subTitle: {
    fontSize: 20,
    color: 'white',
  },
  openingHour: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingTop: 50,
  },
  button: {
    backgroundColor: DefaultColor.actionButtonColor,
    width: 300,
    height: 45,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 5,
  },
});
