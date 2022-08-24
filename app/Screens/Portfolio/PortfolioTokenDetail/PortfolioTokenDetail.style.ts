import {appStyles, colors, fonts} from 'app/Styles/theme';
import {generateBoxShadowStyle} from 'app/Utils/boxShadow';
import normalize, {width} from 'app/Utils/normalize';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    ...appStyles.flex1,
    marginHorizontal: normalize(16),
    marginTop: normalize(18, 'height'),
  },
  chartContent: {
    backgroundColor: 'rgba(86, 123, 167, 0.25)',
    borderColor: 'rgba(218, 218, 218, 0.1)',
    borderWidth: 1,
    borderRadius: normalize(8),
    height: normalize(332, 'height'),
    overflow: 'hidden',
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
    width: normalize(32),
    height: normalize(32),
    marginRight: normalize(20),
    borderRadius: normalize(40),
  },
  coinText: {
    ...fonts.regular,
    fontStyle: 'normal',
    fontSize: normalize(21),
    lineHeight: normalize(31),
    color: colors.white,
  },
  chartIcon: {
    width: normalize(70),
    height: normalize(28),
  },
  coinValueTxt: {
    ...fonts.regular,
    fontStyle: 'normal',
    fontSize: normalize(21),
    lineHeight: normalize(31, 'height'),
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
    paddingTop: normalize(13, 'height'),
    paddingHorizontal: normalize(15),

    paddingBottom: normalize(9, 'height'),
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
  h4: {
    height: normalize(4, 'height'),
  },

  tokenContent: {
    paddingTop: normalize(20, 'height'),
    paddingBottom: normalize(11, 'height'),
    ...appStyles.flexRowAICenterJBetween,
  },
  tabText: {
    ...fonts.regular,
    fontSize: normalize(16),
    fontStyle: 'normal',
    lineHeight: normalize(24),
    color: colors.white,
    textAlign: 'center',
  },
  tabBtn: {
    paddingHorizontal: normalize(10),
    paddingTop: normalize(3, 'height'),
    paddingBottom: normalize(4, 'height'),

    borderRadius: normalize(8),
    minWidth: normalize(63),
    ...appStyles.flexRowAJCenter,
  },
  tabIcon: {
    width: normalize(11),
    height: normalize(11),
    marginRight: normalize(4),
  },
  tabWrapper: {
    ...appStyles.flexRowAICenterJBetween,
    paddingTop: normalize(25, 'height'),
    paddingBottom: normalize(10, 'height'),
  },
  mr5: {
    marginRight: normalize(5),
  },
  activeTabBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityIcon: {
    width: normalize(9),
    height: normalize(9),
    marginRight: normalize(5),
  },
  coinSMTxt: {
    ...fonts.regular,
    fontStyle: 'normal',
    fontSize: normalize(16),
    lineHeight: normalize(24),
    color: colors.white,
    maxWidth: normalize(240),
    textDecorationLine: 'underline',
  },
  activityDateTxt: {
    ...fonts.regular,
    fontStyle: 'normal',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    color: colors.white,
  },
  activityAmtTxt: {
    ...fonts.regular,
    fontStyle: 'normal',
    fontSize: normalize(14),
    lineHeight: normalize(21),
    color: colors.white,
  },
  chartTabBtn: {
    paddingHorizontal: normalize(11),
    paddingTop: normalize(4, 'height'),
    paddingBottom: normalize(5, 'height'),

    borderRadius: normalize(10),
    minWidth: normalize(36),
    ...appStyles.flexRowAJCenter,
  },
  activeChartTabBg: {
    backgroundColor: '#7989AB',
    borderColor: '#7989AB',
  },
  chartTabText: {
    ...fonts.regular,
    fontSize: normalize(16),
    fontStyle: 'normal',
    lineHeight: normalize(24),
    color: colors.white,
    textAlign: 'center',
  },
  chartTabWrapper: {
    ...appStyles.flexRowAICenterJBetween,
    paddingHorizontal: normalize(15),
    zIndex: 100000,
    position: 'absolute',
    width: '100%',
    bottom: normalize(22, 'height'),
  },
});

export default styles;
