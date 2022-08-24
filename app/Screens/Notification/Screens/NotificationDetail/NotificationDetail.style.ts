import {appStyles, colors, fonts} from 'app/Styles/theme';
import normalize, {height} from 'app/Utils/normalize';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(86, 123, 167, 0.25)',
    borderWidth: 1,
    borderColor: ' rgba(218, 218, 218, 0.1)',
    borderRadius: normalize(8),
    marginHorizontal: normalize(14),
    paddingHorizontal: normalize(19),
    paddingVertical: normalize(3, 'height'),
    paddingTop: normalize(16.5, 'height'),
    paddingBottom: normalize(46, 'height'),
    marginTop: normalize(10),
    marginBottom: normalize(23, 'height'),
    ...appStyles.flexRow,
  },
  notfItemIcon: {
    width: normalize(16),
    height: normalize(16),
    marginRight: normalize(8),
    marginTop: normalize(5),
  },
  notfItemTitle: {
    ...fonts.regular,
    fontSize: normalize(15),
    lineHeight: normalize(21),
    textTransform: 'capitalize',
    color: colors.white,
  },
  notfItemDesc: {
    ...fonts.light,
    fontSize: normalize(14),
    lineHeight: normalize(24),
    textTransform: 'capitalize',
    color: colors.white,
  },
  notfItemTime: {
    ...fonts.light,
    fontSize: normalize(13),
    lineHeight: normalize(16),
    textTransform: 'capitalize',
    color: colors.white,
    opacity: 0.7,
    marginTop: 10,
  },
});
export default styles;
