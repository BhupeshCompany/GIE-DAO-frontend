import {appStyles, colors, fonts} from 'app/Styles/theme';
import normalize, {height, width} from 'app/Utils/normalize';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(86, 123, 167, 0.25)',
    borderWidth: 1,
    borderColor: ' rgba(218, 218, 218, 0.1)',
    borderRadius: normalize(8),
    marginHorizontal: normalize(14),
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(3, 'height'),
    marginTop: normalize(10),
    marginBottom: normalize(23, 'height'),

    flex: 1,
  },
  notfItemWrapper: {
    ...appStyles.flexRow,
    paddingBottom: normalize(8),
    paddingTop: normalize(15),
  },
  notfItemIcon: {
    width: normalize(15),
    height: normalize(15),
    marginRight: normalize(8),
    marginTop: normalize(5),
  },
  notfItemTitle: {
    ...fonts.regular,
    fontSize: normalize(14),
    lineHeight: normalize(21),
    textTransform: 'capitalize',
    color: colors.white,
  },
  notfItemDesc: {
    ...fonts.light,
    fontSize: normalize(12),
    lineHeight: normalize(18),
    textTransform: 'capitalize',
    color: colors.white,
    width: width - normalize(90),
  },
  notfItemTime: {
    ...fonts.light,
    fontSize: normalize(11),
    lineHeight: normalize(16),
    textTransform: 'capitalize',
    color: colors.white,
    opacity: 0.7,
  },
  notfDividerLine: {
    height: 1,
    backgroundColor: 'rgba(86, 123, 167, 0.15)',
  },
});
export default styles;
