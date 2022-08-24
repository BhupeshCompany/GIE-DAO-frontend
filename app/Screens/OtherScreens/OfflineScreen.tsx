import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  Platform,
  Text,
  ActivityIndicator,
} from 'react-native';
import GradientBackGround from '../../Components/GradientBackGround';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import {colors} from '../../Styles/theme';

const deviceWidth = Dimensions.get('screen').width;

export default function OfflineScreen() {
  return (
    <GradientBackGround>
      <SafeAreaView>
        <StatusBar hidden={false} barStyle="light-content" />
        <View style={styles.subHolder}>
          <HeaderTitleHolder
            headerTitle="Offline"
            headerSubTitle="It seems like you lost your internet connection"
            entypoIconName="block"
          />
          <ActivityIndicator color={'#fff'} size="large" />
          <View style={styles.buttonHolder}>
            <Text style={{color: '#fff', fontSize: 14, fontWeight: '500'}}>
              Please wait, actively looking for internet connection
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </GradientBackGround>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    flex: 0.7,
    justifyContent: 'space-evenly',
    marginTop: Platform.OS == 'ios' ? 20 : 70,
  },
  buttonHolder: {
    borderColor: colors.fieldHolderBorder,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: deviceWidth - 28,
    maxHeight: deviceWidth / 1.2,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 16,
    backgroundColor: colors.fieldHolderBg,
    marginTop: 25,
    paddingVertical: 20,
  },
});
