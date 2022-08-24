import normalize from '../Utils/normalize';
import {StyleSheet} from 'react-native';

type Colors = {
  fieldHolderBg: string;
  fieldHolderBorder: string;
  white: string;
  errorbg: string;
  green: string;
  red: string;
};

export const colors: Colors = {
  fieldHolderBg: 'rgba(86, 123, 167, 0.25)',
  fieldHolderBorder: 'rgba(218,218,218,0.1)',
  white: '#ffffff',
  errorbg: 'rgba(255, 15, 44, 0.75)',
  green: '#2DBC41',
  red: '#E52E2F',
};

export const fonts = {
  regular: {
    fontFamily: 'Heebo-Regular',
  },
  medium: {
    fontFamily: 'Heebo-Medium',
  },
  bold: {fontFamily: 'Heebo-Bold'},
  light: {fontFamily: 'Heebo-Light'},

  extraBold: {
    fontFamily: 'Heebo-ExtraBold',
  },
  black: {
    fontFamily: 'Heebo-Black',
  },
  thin: {
    fontFamily: 'Heebo-Thin',
  },
};

export const appStyles = StyleSheet.create({
  flex1: {flex: 1},
  flexRow: {
    flexDirection: 'row',
  },
  flexRowJCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  flexRowACenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowAJCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRowAICenterJBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mt1: {
    marginTop: normalize(1, 'height'),
  },
  mt2: {
    marginTop: normalize(2, 'height'),
  },
  mt3: {
    marginTop: normalize(3, 'height'),
  },
  mt4: {
    marginTop: normalize(4, 'height'),
  },
  mt5: {
    marginTop: normalize(5, 'height'),
  },
  mt6: {
    marginTop: normalize(6, 'height'),
  },
});
