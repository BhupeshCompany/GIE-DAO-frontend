import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {useMutation} from '@apollo/client';
import CountDown from 'react-native-countdown-component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CREATE_USER,
  SEND_PHONE_OTP,
  SEND_EMAIL_OTP,
} from '../../GraphqlOperations/mutation/mutation';

import GradientBackGround from '../../Components/GradientBackGround';
import {LoginContext} from '../../Constants/AllContext';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import {colors} from '../../Styles/theme';
import TermsModel from 'app/Components/TermsModel';
import QuestionLogo from 'app/Components/QuestionLogo';
import {termData} from 'app/Utils/termModelContain';

/**constants */
const behaviorForKeyboard = Platform.OS === 'ios' ? 'padding' : 'height';
const deviceWidth = Dimensions.get('screen').width;

const VerifyOtpScreen = ({navigation, route}) => {
  const [phoneOtp, setPhoneOtp] = useState<string>('');
  const [mailOtp, setMailOtp] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNo, setPhoneNo] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isResentActive, setResentActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');
  const {setToken, setIsWalletPasswordEntered} = useContext(LoginContext);

  const [createUser, {loading}] = useMutation(CREATE_USER);
  const [resentPhoneOTP] = useMutation(SEND_PHONE_OTP);
  const [resentMailOTP] = useMutation(SEND_EMAIL_OTP);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  useEffect(() => {
    const {
      userNameFromRoute,
      emailFromRoute,
      phoneNoFromRoute,
      passwordFromRoute,
      countryCodeFromRoute,
    } = route.params;
    setUserName(userNameFromRoute);
    setEmail(emailFromRoute);
    setPhoneNo(phoneNoFromRoute);
    setPassword(passwordFromRoute);
    setCountryCode(countryCodeFromRoute);
  }, [route.params]);

  /**API call to create user on providing valid OTPs */
  const createUserBySignin = async () => {
    try {
      await createUser({
        variables: {
          name: userName,
          email: email,
          phone: phoneNo,
          password: password,
          emailOtp: mailOtp,
          phoneOtp: phoneOtp,
        },
      }).then(async result => {
        const LocalToken = result.data.signup.token;
        setToken(LocalToken);
        try {
          await AsyncStorage.setItem('token', LocalToken).then(() => {
            setIsWalletPasswordEntered(false);
          });
        } catch (e) {
          setErrorMessage(e.message);
        }
      });
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  /** API Call to resend Phone otp*/
  const resentPhoneOtpMethod = async () => {
    try {
      await resentPhoneOTP({
        variables: {
          resendOTP: true,
          requestType: 'SIGNUP',
          countryCode: countryCode,
          phone: phoneNo,
        },
      });
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  /**API call to resend mail OTP */
  const resentMailOtpMethod = async () => {
    try {
      await resentMailOTP({
        variables: {
          resendOTP: true,
          requestType: 'SIGNUP',
          email: email,
        },
      });
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  /**render warning depend on condition */
  const handelWarning = () => {
    if (errorMessage) {
      return (
        <View
          style={{
            backgroundColor: colors.errorbg,
            width: '100%',
            padding: 5,
            alignSelf: 'center',
          }}>
          <Text style={{color: 'rgba(255,255,255,1)', fontSize: 11}}>
            {errorMessage}
          </Text>
        </View>
      );
    }
    return null;
  };

  /**Color changes based on condition */
  const textColorForActive = () => {
    if (isResentActive) {
      return 'rgba(255,255,255,1)';
    }
    return 'rgba(255,255,255,0.5)';
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
    <KeyboardAvoidingView style={{flex: 1}} behavior={behaviorForKeyboard}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GradientBackGround>
          <SafeAreaView>
            <View style={[styles.subHolder, {flex: 1}]}>
              <ScrollView>
                <HeaderTitleHolder
                  antDesign="lock"
                  headerTitle="Verify OTP"
                  headerSubTitle="You cannot trade or invest until you verify your email and phone number."
                />
                <CountDown
                  until={60}
                  size={20}
                  onFinish={() => setResentActive(true)}
                  digitStyle={{backgroundColor: null, margin: -10}}
                  digitTxtStyle={{color: '#fff'}}
                  timeToShow={['M', 'S']}
                  timeLabels={{m: null, s: null}}
                  showSeparator
                  separatorStyle={{color: '#fff'}}
                />
                <View style={styles.fieldHolder}>
                  <View>
                    <Text style={{alignSelf: 'center', color: '#fff'}}>
                      Enter Email OTP
                    </Text>
                    <Input
                      value={mailOtp}
                      onChangeText={text => {
                        setMailOtp(text);
                      }}
                      textStyle={styles.textInputField}
                      style={styles.textInputStyle}
                      maxLength={6}
                      errorContainer={
                        <View>
                          <Text style={styles.subHeadingText}>
                            {`Email sent to ${email} with OTP`}
                          </Text>
                          <TouchableOpacity
                            style={styles.resendButtonStyle}
                            onPress={() => {
                              if (isResentActive) {
                                resentMailOtpMethod();
                              }
                            }}>
                            <Text
                              style={{
                                fontSize: 14,
                                color: textColorForActive(),
                                alignSelf: 'center',
                                fontWeight: '500',
                              }}>
                              Resend OTP
                            </Text>
                          </TouchableOpacity>
                        </View>
                      }
                      keyboardType={'number-pad'}
                    />
                    {handelWarning()}
                  </View>
                  <View style={styles.middleLine} />
                  <View>
                    <Text style={{alignSelf: 'center', color: '#fff'}}>
                      Enter phone number OTP
                    </Text>
                    <Input
                      value={phoneOtp}
                      onChangeText={text => {
                        setPhoneOtp(text);
                      }}
                      textStyle={styles.textInputField}
                      style={styles.textInputStyle}
                      maxLength={6}
                      errorContainer={
                        <View>
                          <Text style={styles.subHeadingText}>
                            {`OTP sent to ${phoneNo}`}
                          </Text>
                          <TouchableOpacity
                            style={styles.resendButtonStyle}
                            onPress={() => {
                              if (isResentActive) {
                                resentPhoneOtpMethod();
                              }
                            }}>
                            <Text
                              style={[
                                styles.resentOtpStyle,
                                {
                                  color: textColorForActive(),
                                },
                              ]}>
                              Resend OTP
                            </Text>
                          </TouchableOpacity>
                        </View>
                      }
                      keyboardType={'number-pad'}
                    />
                  </View>
                </View>
                <Button
                  lable="Verify OTP"
                  labelStyle={styles.labelStyle}
                  onPress={() => {
                    createUserBySignin();
                  }}
                  buttonStyle={{alignSelf: 'center'}}
                  buttonWidth={240}
                  buttonHeight={56}
                  showActivityIndicator={loading}
                />
              </ScrollView>
            </View>
          </SafeAreaView>
          {showTermsModelMethod()}
        </GradientBackGround>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS == 'ios' ? 20 : 90,
  },
  fieldHolder: {
    borderColor: colors.fieldHolderBorder,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: deviceWidth / 1.25,
    width: deviceWidth - 28,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 16,
    backgroundColor: colors.fieldHolderBg,
    marginBottom: 25,
  },
  labelStyle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  textInputStyle: {
    width: 150,
    margin: 8,
    padding: Platform.OS === 'ios' ? 10 : 0,
    color: '#fff',
    alignSelf: 'center',
  },
  resentOtpStyle: {
    fontSize: 14,
    alignSelf: 'center',
    fontWeight: '500',
  },
  wholeFieldStyle: {
    width: deviceWidth - 65,
  },
  textInputField: {
    padding: Platform.OS == 'ios' ? 4 : 7,
    letterSpacing: 8,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  resendButtonStyle: {
    padding: 7,
    width: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignSelf: 'center',
    borderRadius: 8,
    marginVertical: 4,
  },
  subHeadingText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    alignSelf: 'center',
  },
  middleLine: {
    borderBottomWidth: 1,
    borderColor: '#214674',
    width: '90%',
  },
});
