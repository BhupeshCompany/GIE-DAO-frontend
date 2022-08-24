import {useNavigation} from '@react-navigation/native';
import {appStyles, colors, fonts} from 'app/Styles/theme';
import normalize from 'app/Utils/normalize';
import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
type I_ScreenHeader = {
  title?: string;
  hasBackBtn?: boolean;
  routeName?: string;
  type?: 'notification';
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
};
const ScreenHeader = (props: I_ScreenHeader) => {
  const {
    title = 'Portfolio',
    hasBackBtn = false,
    routeName = '',
    type,
    onNotificationClick,
    onSettingsClick,
    onHelpClick,
  } = props;
  const navigation: any = useNavigation();

  if (type === 'notification') {
    return (
      <View style={styles.wrapper}>
        {hasBackBtn ? (
          <TouchableOpacity
            onPress={() =>
              routeName ? navigation.navigate(routeName) : navigation.goBack()
            }>
            <Image
              source={require('app/Assets/Png/asset-go-back.png')}
              style={styles.goBackIcon}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Image
              source={require('app/Assets/Png/asset-app-logo.png')}
              style={styles.logoIcon}
            />
          </TouchableOpacity>
        )}

        <View style={styles.titleWrapper}>
          <Text style={[styles.title]}>{title}</Text>
        </View>
        <View style={appStyles.flexRowACenter}>
          <TouchableOpacity onPress={onNotificationClick}>
            <Image
              source={require('app/Assets/Png/asset-notification.png')}
              style={[styles.helpIcon, styles.ml15]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onHelpClick}>
            <Image
              source={require('app/Assets/Png/asset-help.png')}
              style={[styles.helpIcon, styles.ml15]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettingsClick}>
            <Image
              source={require('app/Assets/Png/asset-settings.png')}
              style={[styles.helpIcon, styles.ml15]}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.wrapper}>
      {hasBackBtn ? (
        <TouchableOpacity
          onPress={() =>
            routeName ? navigation.navigate(routeName) : navigation.goBack()
          }>
          <Image
            source={require('app/Assets/Png/asset-go-back.png')}
            style={styles.goBackIcon}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity>
          <Image
            source={require('app/Assets/Png/asset-app-logo.png')}
            style={styles.logoIcon}
          />
        </TouchableOpacity>
      )}

      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onHelpClick}>
        <Image
          source={require('app/Assets/Png/asset-help.png')}
          style={styles.helpIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ScreenHeader;

const styles: any = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'center',
    paddingHorizontal: normalize(13),
    paddingVertical: normalize(13, 'height'),
    backgroundColor: 'rgba(6, 33, 66, 0.25)',
    minHeight: normalize(54, 'height'),
    paddingTop:
      Platform.OS === 'ios' ? normalize(50, 'height') : normalize(13, 'height'),
  },
  title: {
    ...fonts.regular,
    fontStyle: 'normal',
    fontSize: normalize(16),

    color: colors.white,
    opacity: 0.9,
  },
  logoIcon: {
    height: normalize(36),
    width: normalize(36),
  },
  helpIcon: {
    height: normalize(24),
    width: normalize(24),
  },
  goBackIcon: {
    width: normalize(20),
    height: normalize(17.15),
    marginLeft: normalize(10),
  },
  ml15: {
    marginLeft: normalize(15),
  },
  titleWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    ...appStyles.flexRowAJCenter,
  },
});
