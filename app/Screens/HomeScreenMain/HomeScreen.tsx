import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import {Routes} from 'app/NavigationContainers/Routes';
import {termData} from 'app/Utils/termModelContain';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Text,
  Platform,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {useDispatch} from 'react-redux';
import GradientBackGround from '../../Components/GradientBackGround';
import Model from '../../Components/Model';
import * as authActions from 'app/Redux/Auth/action';
import ScreenHeader from 'app/Components/ScreenHeader';
const modelPng = require('../../Assets/Png/homeModel.png');
const deviceWidth = Dimensions.get('screen').width;

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [showModel, setShowModel] = useState<boolean>(false);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  const renderModel = () => {
    if (showModel) {
      return (
        <Model
          source={modelPng}
          header="Coming Soon"
          subHeader="We are currently working on it, stay tuned."
          HeaderStyle={{color: '#25BD4F', fontSize: 16}}
          onClose={() => {
            setShowModel(false);
          }}
          messageOnButton="Okay"
        />
      );
    }
  };

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
  useEffect(() => {
    dispatch(authActions.getUserStart());
  }, [dispatch]);

  return (
    <GradientBackGround>
      <SafeAreaView>
        <StatusBar hidden={false} barStyle="light-content" />
        <View style={styles.subHolder}>
          <View style={styles.buttonHolder}>
            <FlatList
              data={[
                {
                  id: '1',
                  title: 'Profile',
                  image: require('../../Assets/Png/home1.png'),
                  moveTo: 'UserProfileScreen',
                },
                {
                  id: '2',
                  title: 'Portfolio',
                  image: require('../../Assets/Png/home2.png'),
                  moveTo: Routes.portfolioHome,
                },
                {
                  id: '3',
                  title: 'Buy & Sell',
                  image: require('../../Assets/Png/home3.png'),
                },
                {
                  id: '4',
                  title: 'Swap',
                  image: require('../../Assets/Png/home4.png'),
                  moveTo: 'SwapScreenHold',
                  subMove: 'Swap',
                },
                {
                  id: '5',
                  title: 'Non-Profit',
                  image: require('../../Assets/Png/home5.png'),
                  moveTo: 'PartnersMainScreen',
                },
                {
                  id: '6',
                  title: 'Send & Receive',
                  image: require('../../Assets/Png/home6.png'),
                  moveTo: 'SendTokenHomeScreen',
                },
                {
                  id: '7',
                  title: 'Education',
                  image: require('../../Assets/Png/home7.png'),
                  moveTo: 'EductionalMainScreen',
                },
                {
                  id: '8',
                  title: 'Notification',
                  image: require('../../Assets/Png/home9.png'),
                  moveTo: Routes.notificationHome,
                },
                {
                  id: '9',
                  title: 'Staking',
                  image: require('../../Assets/Png/home9.png'),
                },
              ]}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    style={styles.flagHolder}
                    onPress={() => {
                      if (item.moveTo && !item?.subMove) {
                        navigation.navigate(item.moveTo);
                      } else if (item.moveTo && item?.subMove) {
                        navigation.navigate(item.moveTo, {
                          screen: item.subMove,
                        });
                      } else {
                        setShowModel(true);
                      }
                    }}>
                    <Image
                      source={item.image}
                      style={{height: 45, width: 35}}
                      resizeMode="contain"
                    />
                    <Text
                      style={{color: '#fff', fontWeight: '500', fontSize: 13}}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={item => item.id}
              numColumns={3}
            />
          </View>
        </View>
      </SafeAreaView>
      {renderModel()}
      {showTermsModelMethod()}
    </GradientBackGround>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  subHolder: {
    width: deviceWidth - 28,
    flex: 0.95,
    justifyContent: 'flex-end',
    alignContent: 'center',
    marginTop: Platform.OS == 'ios' ? 20 : 65,
  },
  buttonHolder: {
    justifyContent: 'center',
    height: deviceWidth / 1.2,
    alignItems: 'center',
  },
  labelStyle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  flagHolder: {
    height: deviceWidth / 4.7,
    width: deviceWidth / 4.3,
    backgroundColor: '#04223C',
    borderRadius: 8,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#020A11',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 4,
    shadowOpacity: 0.8,
    margin: 12,
  },
  checkBoxStyle:
    Platform.OS === 'ios'
      ? {
          height: 18,
          width: 18,
          borderWidth: 1,
          borderColor: '#fff',
          borderRadius: 5,
          backgroundColor: '#DADADA',
        }
      : {},
});
