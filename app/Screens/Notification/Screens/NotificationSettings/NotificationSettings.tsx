import React, {useEffect, useState} from 'react';
import GradientFill from 'app/Components/GradientFill';
import ScreenHeader from 'app/Components/ScreenHeader';
import {Image, SafeAreaView, Text, View} from 'react-native';
import styles from './NotificationSettings.style';
import ToggleButton from 'app/Components/ToggleBtn';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'app/Redux/store';
import {useMutation} from '@apollo/client';
import {UPDATE_NOTF_PREFERENCE} from 'app/GraphqlOperations/mutation/mutation';
import ScreenLoader from 'app/Components/ScreenLoader';
import EncryptedStorage from 'react-native-encrypted-storage';
import storageString from 'app/Constants/webStorageString';
import * as authActions from 'app/Redux/Auth/action';
const NotificationSettings = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const notification = useSelector(
    (state: RootState) => state.Auth?.user?.notification,
  );

  const [isEnabled, setEnabled] = useState({
    isAllowNotf: true,
    isCryptoUpdates: false,
    isGIEtokenUpdates: false,
    isDonationUpdates: false,
    isGIEnotification: false,
  });
  const [updateNotfPref, {loading, error, data}] = useMutation(
    UPDATE_NOTF_PREFERENCE,
  );

  const handleToggleBtn = (value, isEnb) => async () => {
    setEnabled(values => {
      return {...values, [value]: !isEnb};
    });
    try {
      setLoading(true);
      switch (value) {
        case 'isCryptoUpdates':
          await updateNotfPref({variables: {cryptoUpdate: !isEnb}});
          break;
        case 'isGIEtokenUpdates':
          await updateNotfPref({variables: {gieTokenUpdate: !isEnb}});
          break;
        case 'isDonationUpdates':
          await updateNotfPref({variables: {donationUpdate: !isEnb}});
          break;
        case 'isGIEnotification':
          await updateNotfPref({variables: {gieNotification: !isEnb}});
          break;
        case 'isAllowNotf':
          await EncryptedStorage.setItem(
            storageString.isAllAllowNotf,
            JSON.stringify(!isEnb),
          );
          await updateNotfPref({
            variables: {
              cryptoUpdate: !isEnb,
              gieTokenUpdate: !isEnb,
              donationUpdate: !isEnb,
              gieNotification: !isEnb,
            },
          });
          break;

        default:
          break;
      }
      dispatch(authActions.getUserStart());
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (notification) {
      setEnabled(values => ({
        ...values,
        isCryptoUpdates: notification.cryptoUpdate,
        isGIEtokenUpdates: notification.gieTokenUpdate,
        isDonationUpdates: notification.donationUpdate,
        isGIEnotification: notification.gieNotification,
        isAllowNotf: notification.isAllNotf,
      }));
    }
  }, [notification]);
  return (
    <GradientFill>
      <ScreenHeader title="Settings" hasBackBtn={true} />
      <SafeAreaView style={styles.container}>
        <Image
          source={require('app/Assets/Png/asset-bell-big.png')}
          style={styles.bellIcon}
        />
        <Text style={styles.screenTitle}>Notification Settings</Text>
        <Text style={styles.screenDesc}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue,
          sem et bibendum.
        </Text>
        <View style={styles.mainContent}>
          <View>
            <Text style={styles.notfTitle}>Enable Notifications</Text>
            <View style={styles.notfSwitcherWrapper}>
              <Text style={styles.notfTitle}>Allow Notifications</Text>
              <ToggleButton
                value={isEnabled.isAllowNotf}
                onValueChange={handleToggleBtn(
                  'isAllowNotf',
                  isEnabled.isAllowNotf,
                )}
              />
            </View>
          </View>
          <View style={styles.mt15}>
            <Text style={styles.notfTitle}>Notification Types</Text>
            <View style={styles.notfSwitcherWrapper}>
              <Text style={styles.notfTitle}>Crypto Updates & Offerings</Text>
              <ToggleButton
                value={isEnabled.isCryptoUpdates}
                onValueChange={handleToggleBtn(
                  'isCryptoUpdates',
                  isEnabled.isCryptoUpdates,
                )}
              />
            </View>
            <View style={styles.notfSwitcherWrapper}>
              <Text style={styles.notfTitle}>GIE Token Updates</Text>
              <ToggleButton
                value={isEnabled.isGIEtokenUpdates}
                onValueChange={handleToggleBtn(
                  'isGIEtokenUpdates',
                  isEnabled.isGIEtokenUpdates,
                )}
              />
            </View>
            <View style={styles.notfSwitcherWrapper}>
              <Text style={styles.notfTitle}>Donation Updates</Text>
              <ToggleButton
                value={isEnabled.isDonationUpdates}
                onValueChange={handleToggleBtn(
                  'isDonationUpdates',
                  isEnabled.isDonationUpdates,
                )}
              />
            </View>
            <View style={styles.notfSwitcherWrapper}>
              <Text style={styles.notfTitle}>GIE Notification</Text>
              <ToggleButton
                value={isEnabled.isGIEnotification}
                onValueChange={handleToggleBtn(
                  'isGIEnotification',
                  isEnabled.isGIEnotification,
                )}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
      {isLoading ? <ScreenLoader /> : null}
    </GradientFill>
  );
};
export default NotificationSettings;
