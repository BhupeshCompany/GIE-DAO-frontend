import {appStyles, colors, fonts} from 'app/Styles/theme';
import {generateBoxShadowStyle} from 'app/Utils/boxShadow';
import normalize from 'app/Utils/normalize';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...appStyles.flex1,
    marginHorizontal: normalize(16),
    marginTop: normalize(18, 'height'),
  },
  topContent: {
    backgroundColor: 'rgba(86, 123, 167, 0.25)',
    borderColor: 'rgba(218, 218, 218, 0.1)',
    borderWidth: 1,
    borderRadius: normalize(8),
    padding: normalize(12),
    paddingTop: normalize(21),
  },
  walletBlText: {
    ...fonts.light,
    fontStyle: 'normal',
    fontSize: normalize(13),
    lineHeight: normalize(16),
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  walletAmtText: {
    ...fonts.regular,
    fontStyle: 'normal',
    fontSize: normalize(21),
    lineHeight: normalize(31),
    color: colors.white,
    textAlign: 'center',
  },
  navBtn: {
    padding: normalize(12),
    paddingBottom: normalize(8),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: normalize(8),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    ...generateBoxShadowStyle({
      xOffset: 0,
      yOffset: 4,
      shadowColorIos: 'rgba(48, 42, 42, 0.25)',
      shadowColorAndroid: 'rgba(48, 42, 42, 0.25)',
      shadowRadius: 16,
      shadowOpacity: 1,
    }),
  },
  navIcon: {
    height: normalize(36),
    width: normalize(36),
  },
  navTitle: {
    ...fonts.regular,
    fontStyle: 'normal',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    color: '#F2F2F2',
  },
  navBtnWrapper: {
    flexDirection: 'row',
    marginTop: normalize(22, 'height'),
  },
  mr7: {
    marginRight: normalize(7),
  },
  bottomContent: {
    paddingTop: normalize(20, 'height'),
  },
  bcTitleWrapper: {
    ...appStyles.flexRowAICenterJBetween,
  },
  bcTitle: {
    ...fonts.regular,
    fontStyle: 'normal',
    fontSize: normalize(16),
    lineHeight: normalize(24),
    color: colors.white,
  },
  coinIcon: {
    width: normalize(36),
    height: normalize(36),
    marginRight: normalize(10),
    borderRadius: normalize(40),
  },
  coinText: {
    ...fonts.regular,
    fontStyle: 'normal',
    fontSize: normalize(16),
    lineHeight: normalize(24),
    color: colors.white,
  },
  chartIcon: {
    width: normalize(70),
    height: normalize(28),
  },
  coinValueTxt: {
    ...fonts.regular,
    fontStyle: 'normal',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    color: colors.white,
    textAlign: 'right',
  },
  marketIcon: {
    width: normalize(12),
    height: normalize(6),
    marginRight: normalize(3),
  },
  marketValueTxt: {
    ...fonts.regular,
    fontStyle: 'normal',
    fontSize: normalize(12),
    lineHeight: normalize(18),
    color: '#2DBC41',
  },
  tokenItemWrapper: {
    ...appStyles.flexRowAICenterJBetween,
    paddingTop: normalize(13),
    paddingLeft: normalize(14),
    paddingRight: normalize(15),
    paddingBottom: normalize(15),
    backgroundColor: 'rgba(2, 18, 38, 0.4)',
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: 'rgba(218, 218, 218, 0.1)',
    ...generateBoxShadowStyle({
      xOffset: 0,
      yOffset: 4,
      shadowColorIos: 'rgba(48, 42, 42, 0.25)',
      shadowColorAndroid: 'rgba(48, 42, 42, 0.25)',
      shadowRadius: 16,
      shadowOpacity: 1,
    }),
  },
  h8: {
    height: normalize(8),
  },
  tokenContainer: {
    paddingTop: normalize(12, 'height'),
  },
  chartStyle: {
    alignSelf: 'center',
    paddingRight: 0,
    paddingLeft: 0,
    paddingTop: 0,
  },
});

export default styles;
