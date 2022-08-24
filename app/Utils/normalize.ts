import {PixelRatio, Dimensions, StyleSheet, Platform} from 'react-native';

const ratio = PixelRatio.get();
export const {height, width} = Dimensions.get('window');
export var {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} =
  Dimensions.get('window');

// figma design scale

const wscale: number = SCREEN_WIDTH / 428;
const hscale: number = SCREEN_HEIGHT / 926;

function normalize(size: number, based: 'width' | 'height' = 'width') {
  const newSize = based === 'height' ? size * hscale : size * wscale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export const create = (
  styles,
  targetProperties = [
    'fontSize',
    'margin',
    'marginHorizontal',
    'marginVertical',
    'padding',
    'paddingVertical',
    'paddingHorizontal',
    'height',
  ],
) => {
  const normalizedStyles = {};
  Object.keys(styles).forEach(key => {
    normalizedStyles[key] = {};
    Object.keys(styles[key]).forEach(property => {
      if (targetProperties.includes(property)) {
        normalizedStyles[key][property] = normalize(styles[key][property]);
      } else {
        normalizedStyles[key][property] = styles[key][property];
      }
    });
  });

  return StyleSheet.create(normalizedStyles);
};

export default normalize;
