import {appStyles, colors, fonts} from 'app/Styles/theme';
import {generateBoxShadowStyle} from 'app/Utils/boxShadow';
import normalize, {height} from 'app/Utils/normalize';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: normalize(14),
    marginTop: normalize(33),
  },
  bellIcon: {
    width: normalize(38.4),
    height: normalize(48),
    alignSelf: 'center',
  },
  screenTitle: {
    ...fonts.bold,
    fontSize: normalize(18),
    lineHeight: normalize(26),
    textAlign: 'center',
    color: colors.white,
    marginTop: normalize(8),
  },
  screenDesc: {
    ...fonts.regular,
    fontSize: normalize(16),
    lineHeight: normalize(24),
    textAlign: 'center',
    color: colors.white,
    marginHorizontal: normalize(16),
    opacity: 0.5,
  },
  mainContent: {
    backgroundColor: 'rgba(86, 123, 167, 0.25)',
    borderWidth: 1,
    borderColor: ' rgba(218, 218, 218, 0.1)',
    borderRadius: normalize(8),
    paddingHorizontal: normalize(19),
    paddingVertical: normalize(3, 'height'),
    paddingTop: normalize(16.5, 'height'),
    paddingBottom: normalize(46, 'height'),
    marginTop: normalize(20),
    marginBottom: normalize(23, 'height'),
  },
  notfTitle: {
    ...fonts.regular,
    fontSize: normalize(14),
    lineHeight: normalize(21),

    color: colors.white,
  },
  notfSwitcherWrapper: {
    ...appStyles.flexRowAICenterJBetween,
    paddingVertical: normalize(8),
    paddingLeft: normalize(19),
    paddingRight: normalize(10),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(18, 81, 158, 0.15)',
    ...generateBoxShadowStyle({}),
    borderRadius: normalize(8),
    height: normalize(48, 'height'),
    marginVertical: normalize(8, 'height'),
  },
  mt15: {
    marginTop: normalize(15, 'height'),
  },
});
export default styles;
