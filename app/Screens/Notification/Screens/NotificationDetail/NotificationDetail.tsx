import React from 'react';
import GradientFill from 'app/Components/GradientFill';
import ScreenHeader from 'app/Components/ScreenHeader';
import {Image, SafeAreaView, Text, View} from 'react-native';
import styles from './NotificationDetail.style';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Routes} from 'app/NavigationContainers/Routes';
import RenderHTML from 'react-native-render-html';
import {width} from 'app/Utils/normalize';
import {colors} from 'app/Styles/theme';

const NotificationDetail = () => {
  const route: any = useRoute();
  const data = route?.params?.data;
  const navigation = useNavigation();
  const handleSettingsClick = () => {
    navigation.navigate(Routes.notificationSettings as any);
  };
  return (
    <GradientFill>
      <ScreenHeader
        title="View Notifications"
        type="notification"
        onSettingsClick={handleSettingsClick}
        hasBackBtn={true}
      />
      <View style={styles.container}>
        {data?.type === 'WARNING' ? (
          <Image
            source={require('app/Assets/Png/asset-alert.png')}
            style={styles.notfItemIcon}
          />
        ) : (
          <Image
            source={require('app/Assets/Png/asset-bell.png')}
            style={styles.notfItemIcon}
          />
        )}
        <View>
          <Text style={styles.notfItemTitle}>{data?.englishTitle}</Text>
          <RenderHTML
            contentWidth={width}
            source={{
              html: `<span style='color: ${colors.white};padding:0;margin:0;'>${data?.englishDescription}</span>`,
            }}
          />
          <Text style={styles.notfItemTime}> 2 hours ago</Text>
        </View>
      </View>
    </GradientFill>
  );
};
export default NotificationDetail;
