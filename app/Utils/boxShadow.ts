import {Platform} from 'react-native';

export const generateBoxShadowStyle = ({
  xOffset = 0,
  yOffset = 4,
  shadowColorIos = 'rgba(48, 42, 42, 0.25)',
  shadowColorAndroid = 'rgba(48, 42, 42, 0.25)',
  shadowRadius = 16,
  shadowOpacity = 1,
  elevation = 20,
}) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: shadowColorIos,
      shadowOffset: {width: xOffset, height: yOffset},
      shadowOpacity,
      shadowRadius,
    };
  } else if (Platform.OS === 'android') {
    return {
      elevation,
      shadowColor: shadowColorAndroid,
    };
  }
};
