import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import SendTokens from './SendTokens';
import ReceiveTokens from './ReceiveTokens';

const Tab = createMaterialTopTabNavigator();

import GradientBackGround from '../../Components/GradientBackGround';
import normalize from '../../Utils/normalize';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {termData} from 'app/Utils/termModelContain';

const deviceWidth = Dimensions.get('screen').width;

const SendTokenHomeScreen = ({navigation}) => {
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  const showTermsModelMethod = () => {
    if (showTermsModel) {
      return (
        <TermsModel
          header="Terms Model"
          subHeader={termData}
          HeaderStyle={{color: '#fff', fontSize: 16}}
          onClose={() => {
            setShowTermModel(false);
          }}
        />
      );
    }
  };

  navigation.setOptions({
    headerRight: () => (
      <QuestionLogo onTouchField={() => setShowTermModel(!showTermsModel)} />
    ),
  });

  return (
    <GradientBackGround Style={{flex: 1}}>
      <SafeAreaView style={styles.subHolder}>
        <Tab.Navigator
          screenOptions={({}) => ({
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: '600',
              textTransform: 'none',
            },
            tabBarStyle: {
              backgroundColor: '#fff',
              width: deviceWidth / 2.2,
              height: 38,
              alignSelf: 'center',
              borderWidth: 2,
              borderColor: '#fff',
              marginVertical: 10,
              borderRadius: 20,
            },
            tabBarIndicatorStyle: {
              backgroundColor: 'rgba(4, 34, 60, 1)',
              height: '100%',
              width: '48%',
              borderRadius: 20,
              justifyContent: 'center',
            },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#000',
            tabBarContentContainerStyle: {alignItems: 'center'},
          })}>
          <Tab.Screen
            name="SendTokens"
            component={SendTokens}
            options={{title: 'Send'}}
          />
          <Tab.Screen
            name="ReceiveTokens"
            component={ReceiveTokens}
            options={{title: 'Receive'}}
          />
        </Tab.Navigator>
      </SafeAreaView>
      {showTermsModelMethod()}
    </GradientBackGround>
  );
};

export default SendTokenHomeScreen;

const styles = StyleSheet.create({
  subHolder: {
    width: deviceWidth,
    flex: 1,
    justifyContent: 'flex-end',
    alignContent: 'center',
    marginTop: normalize(75),
  },
});
