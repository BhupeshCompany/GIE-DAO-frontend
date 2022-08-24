import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Platform,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../Styles/theme';
import Button from '../../Components/Button';
import GradientBackGround from '../../Components/GradientBackGround';
import {LoginContext} from '../../Constants/AllContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EncryptedStorage from 'react-native-encrypted-storage';
import Input from '../../Components/Input';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useQuery} from '@apollo/client';
import {useFocusEffect} from '@react-navigation/native';
import {GET_MY_PROFILE} from '../../GraphqlOperations/query/query';
import Loader from '../../Components/Loader';
import Model from '../../Components/Model';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import { termData } from 'app/Utils/termModelContain';
import normalize from 'app/Utils/normalize';
import MyWallet from 'app/Utils/myWallet';

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;
const logoutPng = require('../../Assets/Png/logout.png');
const profilePng = require('../../Assets/Png/profile.png');
const errorPng = require('../../Assets/Png/error.png');

export default function UserProfileScreen({navigation}) {
  const {setToken, setIsWalletPasswordEntered, setRnEW} =
    useContext(LoginContext);
  const {data, refetch, loading, error} = useQuery(GET_MY_PROFILE);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  useFocusEffect(() => {
    refetch();
  });
  /**Logout user */
  const logOutUser = async () => {
    const LocalToken = '';
    setToken(LocalToken);
    try {
      await AsyncStorage.clear();
      await EncryptedStorage.clear();
      setIsWalletPasswordEntered(false);
      setRnEW(null);
    } catch (e) {}
  };
  const handelLoadingAndError = () => {
    if (loading) {
      return (
        <Loader
          header="Please Wait"
          subHeader="Wait while we fetch you data securely"
        />
      );
    }
    if (error) {
      return (
        <Model
          source={errorPng}
          header="An error occured"
          subHeader={error?.message}
          HeaderStyle={{color: 'rgba(255, 15, 44, 0.75)'}}
          onClose={() => navigation.goBack()}
          messageOnButton="Go Back"
        />
      );
    }
    return null;
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

  return (
    <GradientBackGround>
      <SafeAreaView>
        <View style={styles.subHolder}>
          <ScrollView>
            <View style={styles.buttonHolder}>
              <View style={styles.containHolder}>
                <TouchableOpacity
                  style={styles.logoutButtonHolder}
                  onPress={() => {
                    logOutUser();
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 4,
                    }}>
                    <Image source={logoutPng} style={{width: 20, height: 20}} />
                    <Text
                      style={{
                        fontSize: 12,
                        color: '#fff',
                        fontWeight: '600',
                        textDecorationLine: 'underline',
                        paddingHorizontal: 4,
                      }}>
                      Logout
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={{alignItems: 'center', marginBottom: 10}}>
                  <Image
                    source={profilePng}
                    style={{
                      width: 90,
                      height: 90,
                      borderWidth: 4,
                      borderColor: '#D9D9D9',
                      borderRadius: 45,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 20,
                      fontWeight: '600',
                      marginVertical: 6,
                    }}>
                    {data?.getProfile?.name}
                  </Text>
                  <Text style={styles.subHeading}>
                    Update your password, language preference and other
                    information like name, phone number and email. Just select
                    options below.
                  </Text>
                </View>
                <Input
                  value={data?.getProfile?.email}
                  style={styles.textInputStyle}
                  Allstyle={styles.wholeFieldStyle}
                  textStyle={styles.textInputField}
                  leftContainer={
                    <AntDesign name="mail" style={styles.iconStyle} />
                  }
                  placeholder="Enter Email Id"
                  editable={false}
                />
                <Input
                  value={`${data?.getProfile?.countryCode} - ${data?.getProfile?.phone}`}
                  style={styles.textInputStyle}
                  Allstyle={styles.wholeFieldStyle}
                  textStyle={styles.textInputField}
                  leftContainer={
                    <AntDesign name="mobile1" style={styles.iconStyle} />
                  }
                  placeholder="Enter Email Id"
                  editable={false}
                />
                <Button
                  lable="Change Password"
                  labelStyle={styles.labelStyle}
                  buttonWidth={320}
                  buttonHeight={normalize(52)}
                  onPress={() => {
                    /**  navigate to ChangePasswordScreen*/
                    navigation.navigate('ChangePasswordScreen');
                  }}
                  buttonStyle={styles.buttonStyle}
                />
                <Button
                  lable="Change Language"
                  labelStyle={styles.labelStyle}
                  buttonWidth={320}
                  buttonHeight={normalize(52)}
                  onPress={() => {
                    navigation.navigate('UpdateLanguage');
                  }}
                  buttonStyle={styles.buttonStyle}
                />
                <Button
                  lable="Update Profile"
                  labelStyle={styles.labelStyle}
                  buttonWidth={320}
                  buttonHeight={normalize(52)}
                  onPress={async () => {
                    navigation.navigate('UpdateProfile');
                  }}
                  buttonStyle={styles.buttonStyle}
                />
                <Button
                  lable="Export Private Key"
                  labelStyle={styles.labelStyle}
                  buttonWidth={320}
                  buttonHeight={normalize(52)}
                  onPress={async () => {
                    navigation.navigate('PrivateKeyShowScreen');
                  }}
                  buttonStyle={styles.buttonStyle}
                />
                <TouchableOpacity style={styles.linkHolder}>
                  <Text
                    style={[
                      styles.subHeading,
                      {textDecorationLine: 'underline'},
                    ]}>
                    Terms and Conditions
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.linkHolder}>
                  <Text
                    style={[
                      styles.subHeading,
                      {textDecorationLine: 'underline'},
                    ]}>
                    Privacy Policy
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {handelLoadingAndError()}
      {showTermsModelMethod()}
    </GradientBackGround>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  labelStyle: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 15,
  },
  buttonHolder: {
    borderColor: colors.fieldHolderBorder,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    maxHeight: deviceHeight - 50,
    width: deviceWidth - 28,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 16,
    backgroundColor: colors.fieldHolderBg,
    marginVertical: 30,
  },
  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: Platform.OS == 'ios' ? 0 : 50,
  },
  containHolder: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '95%',
    marginBottom: 10,
  },
  textInputStyle: {
    width: '100%',
    padding: Platform.OS === 'ios' ? 9 : 0,
    color: '#fff',
    paddingLeft: 0,
  },
  wholeFieldStyle: {
    width: deviceWidth - 65,
    marginVertical: 8,
  },
  textInputField: {
    padding: Platform.OS == 'ios' ? 4 : 7,
  },
  iconStyle: {
    color: colors.white,
    fontSize: 22,
    paddingLeft: 10,
    marginRight: Platform.OS === 'android' ? -18 : -9,
    flex: 2,
    alignSelf: 'center',
  },
  buttonStyle: {
    marginVertical: normalize(5),
  },
  logoutButtonHolder: {
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    position: 'relative',
    left: 120,
    top: 20,
    zIndex: 4,
  },
  subHeading: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
  },
  linkHolder: {
    marginTop: normalize(20),
    marginBottom: normalize(10),
  },
});
