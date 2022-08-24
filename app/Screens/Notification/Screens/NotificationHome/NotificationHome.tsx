import {useQuery} from '@apollo/client';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import GradientFill from 'app/Components/GradientFill';
import ScreenHeader from 'app/Components/ScreenHeader';
import {GET_NOTIFICATION_LIST} from 'app/GraphqlOperations/query/query';
import {Routes} from 'app/NavigationContainers/Routes';
import React, {useCallback, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './NotificationHome.style';
import RenderHTML from 'react-native-render-html';
import {width} from 'app/Utils/normalize';
import {colors} from 'app/Styles/theme';
import NotificationLoader from './NotificationLoader';
import {client} from 'app/App';
import {updateArray} from 'app/Utils/utilities';
const NotificationHome = () => {
  const navigation = useNavigation();

  const [isLoading, setLoading] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDetailNav = useCallback(
    item => () => {
      navigation.navigate(
        Routes.notificationDetail as never,
        {data: item} as never,
      );
    },
    [navigation],
  );
  const handleSettingsClick = () => {
    navigation.navigate(Routes.notificationSettings as never);
  };

  const loadNotification = useCallback(
    page => async () => {
      try {
        setLoading(true);
        const response = await client.query({
          query: GET_NOTIFICATION_LIST,
          variables: {page: page, limit: 10},
          fetchPolicy: 'no-cache',
        });

        const list = response?.data?.getNotifications?.notifications;

        if (list) {
          setNotificationList(previous => updateArray(previous, list));

          setCurrentPage(current => current + 1);
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useFocusEffect(
    React.useCallback(() => {
      const load = loadNotification(currentPage);
      load();
    }, []),
  );

  const renderNotificationItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.notfItemWrapper}
        onPress={handleDetailNav(item)}>
        {item?.type === 'WARNING' ? (
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
          <Text style={styles.notfItemTitle}>{item?.englishTitle}</Text>

          <RenderHTML
            contentWidth={width}
            source={{
              html: `<span style='color: ${colors.white};padding:0;margin:0;'>${item?.englishDescription}</span>`,
            }}
          />

          <Text style={styles.notfItemTime}> 2 hours ago</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <GradientFill>
      <ScreenHeader
        title="Notifications"
        type="notification"
        onSettingsClick={handleSettingsClick}
      />
      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={notificationList}
          renderItem={renderNotificationItem}
          keyExtractor={(_, index) => index.toString()}
          ItemSeparatorComponent={() => <View style={styles.notfDividerLine} />}
          ListFooterComponent={() =>
            isLoading ? <NotificationLoader /> : null
          }
          onScrollEndDrag={loadNotification(currentPage)}
        />
      </View>
    </GradientFill>
  );
};

export default NotificationHome;
