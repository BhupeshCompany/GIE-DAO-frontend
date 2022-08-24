import React, {useState, useEffect} from 'react';
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
  ScrollView,
  SafeAreaView,
} from 'react-native';

import {useMutation} from '@apollo/client';
import {
  UPDATE_PROFILE,
  SEND_PHONE_OTP,
  SEND_EMAIL_OTP,
} from '../../GraphqlOperations/mutation/mutation';
import CountDown from 'react-native-countdown-component';

import GradientBackGround from '../../Components/GradientBackGround';
import Button from '../../Components/Button';
import Input from '../../Components/Input';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import {colors} from '../../Styles/theme';
import Model from '../../Components/Model';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import { termData } from 'app/Utils/termModelContain';

const behaviorForKeyboard = Platform.OS === 'ios' ? 'padding' : 'height';
const devideWidth = Dimensions.get('screen').width;
const checkImage = require('../../Assets/Png/check.png');

const OtpProfileUpdate = ({navigation, route}) => {
  const [phoneOtp, setPhoneOtp] = useState<string>('');
  const [mailOtp, setMailOtp] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNo, setPhoneNo] = useState<string>('');
  const [typeOfOTP, setTypeOfOTP] = useState<string>('');
  const [isResentActive, setResentActive] = useState<boolean>(false);
  const [, setMessage] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('');

  const [updateProfile, {loading: loadingA, error: errorA, data: dataA}] =
    useMutation(UPDATE_PROFILE);
  const [resentPhoneOTP] = useMutation(SEND_PHONE_OTP);
  const [resentMailOTP] = useMutation(SEND_EMAIL_OTP);
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  useEffect(() => {
    const {
      userNameFromRoute,
      emailFromRoute,
      phoneNoFromRoute,
      typeOfOTPFromRoute,
      countryCodeFromRoute,
    } = route.params;
    setUserName(userNameFromRoute);
    setEmail(emailFromRoute);
    setPhoneNo(phoneNoFromRoute);
    setTypeOfOTP(typeOfOTPFromRoute);
    setCountryCode(countryCodeFromRoute);
  }, [route.params]);

  /**API call update profile */
  const updateProfileMethod = async () => {
    try {
      updateProfile({
        variables: {
          name: userName,
          phone: typeOfOTP === 'phone' || typeOfOTP === 'both' ? phoneNo : null,
          email: typeOfOTP === 'email' || typeOfOTP === 'both' ? email : null,
          prefferedLanguage: null,
          emailOtp:
            typeOfOTP === 'email' || typeOfOTP === 'both' ? mailOtp : null,
          phoneOtp:
            typeOfOTP === 'phone' || typeOfOTP === 'both' ? phoneOtp : null,
        },
      });
    } catch (e) {
      setMessage(e.message);
    }
  };

  /** API Call to resend Phone otp*/
  const resentPhoneOtpMethod = async () => {
    await resentPhoneOTP({
      variables: {
        resendOTP: true,
        requestType: 'UPDATE',
        countryCode: countryCode,
        phone: phoneNo,
      },
    });
  };

  /**API call to resend mail OTP */
  const resentMailOtpMethod = async () => {
    await resentMailOTP({
      variables: {
        resendOTP: true,
        requestType: 'UPDATE',
        email: email,
      },
    });
  };

  /**Based on condition render the otp field */
  const otpFieldRenderType = () => {
    if (typeOfOTP === 'phone' || typeOfOTP === 'email') {
      return typeOfOTP === 'phone' ? (
        <View style={styles.fieldHolder}>
          <View>
            <Text style={styles.fieldHeaderLineText}>
              Enter phone number OTP
            </Text>
            <Input
              value={phoneOtp}
              maxLength={6}
              onChangeText={text => {
                setPhoneOtp(text);
              }}
              textStyle={styles.inputFieldStyle}
              style={styles.textInputStyle}
              keyboardType={'number-pad'}
              errorContainer={
                <View>
                  <Text style={styles.textAtBottomofFieldStyle}>
                    {`OTP sent to ${phoneNo}`}
                  </Text>
                  <TouchableOpacity
                    style={styles.resendButtonStyle}
                    onPress={() => {
                      resentPhoneOtpMethod();
                    }}>
                    <Text
                      style={[
                        styles.resentOtpStyle,
                        {
                          color: isResentActive
                            ? 'rgba(255,255,255,1)'
                            : 'rgba(255,255,255,0.5)',
                        },
                      ]}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
          {errorA && (
            <View style={styles.errorMessageStyle}>
              <Text style={styles.errorTextStyle}>{errorA.message}</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.fieldHolder}>
          <View>
            <Text style={styles.fieldHeaderLineText}>Enter Email OTP</Text>
            <Input
              value={mailOtp}
              maxLength={6}
              onChangeText={text => {
                setMailOtp(text);
              }}
              textStyle={{
                letterSpacing: 8,
                fontSize: 16,
                fontWeight: '500',
                textAlign: 'center',
              }}
              style={styles.textInputStyle}
              keyboardType={'number-pad'}
              errorContainer={
                <View>
                  <Text style={styles.textAtBottomofFieldStyle}>
                    {`Email sent to ${email} with OTP`}
                  </Text>
                  <TouchableOpacity
                    style={styles.resendButtonStyle}
                    onPress={() => {
                      resentMailOtpMethod();
                    }}>
                    <Text
                      style={[
                        styles.resentOtpStyle,
                        {
                          color: isResentActive
                            ? 'rgba(255,255,255,1)'
                            : 'rgba(255,255,255,0.5)',
                        },
                      ]}>
                      Resend OTP
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
          {errorA && (
            <View style={styles.errorMessageStyle}>
              <Text style={styles.errorTextStyle}>{errorA.message}</Text>
            </View>
          )}
        </View>
      );
    }

    return (
      <View style={styles.fieldHolder}>
        <View>
          <Text style={styles.fieldHeaderLineText}>Enter phone number OTP</Text>
          <Input
            value={phoneOtp}
            maxLength={6}
            onChangeText={text => {
              setPhoneOtp(text);
            }}
            textStyle={styles.inputFieldStyle}
            style={styles.textInputStyle}
            keyboardType={'number-pad'}
            errorContainer={
              <View>
                <Text style={styles.textAtBottomofFieldStyle}>
                  {`OTP sent to ${phoneNo}`}
                </Text>
                <TouchableOpacity
                  style={styles.resendButtonStyle}
                  onPress={() => {
                    resentPhoneOtpMethod();
                  }}>
                  <Text
                    style={[
                      styles.resentOtpStyle,
                      {
                        color: isResentActive
                          ? 'rgba(255,255,255,1)'
                          : 'rgba(255,255,255,0.5)',
                      },
                    ]}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
        <View style={styles.seperatorLineStyle} />
        <View>
          <Text style={styles.fieldHeaderLineText}>Enter Email OTP</Text>
          <Input
            value={mailOtp}
            maxLength={6}
            onChangeText={text => {
              setMailOtp(text);
            }}
            textStyle={styles.inputFieldStyle}
            style={styles.textInputStyle}
            keyboardType={'number-pad'}
            errorContainer={
              <View>
                <Text style={styles.textAtBottomofFieldStyle}>
                  {`Email sent to ${email} with OTP`}
                </Text>
                <TouchableOpacity
                  style={styles.resendButtonStyle}
                  onPress={() => {
                    resentMailOtpMethod();
                  }}>
                  <Text
                    style={[
                      styles.resentOtpStyle,
                      {
                        color: isResentActive
                          ? 'rgba(255,255,255,1)'
                          : 'rgba(255,255,255,0.5)',
                      },
                    ]}>
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
        {errorA && (
          <View style={styles.errorMessageStyle}>
            <Text style={styles.errorTextStyle}>{errorA.message}</Text>
          </View>
        )}
      </View>
    );
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
                {otpFieldRenderType()}
                <Button
                  lable="Verify OTP"
                  labelStyle={styles.labelStyle}
                  onPress={() => {
                    updateProfileMethod();
                  }}
                  buttonStyle={{alignSelf: 'center'}}
                  buttonWidth={240}
                  buttonHeight={56}
                  showActivityIndicator={loadingA}
                  disabled={loadingA}
                />
              </ScrollView>
            </View>
          </SafeAreaView>
          {dataA ? (
            <Model
              source={checkImage}
              header="Profile updated successfully"
              subHeader="Information has been changed successfully"
              HeaderStyle={{color: '#25BD4F', fontSize: 16}}
              onClose={() => {
                navigation.goBack();
              }}
            />
          ) : null}
          {showTermsModelMethod()}
        </GradientBackGround>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default OtpProfileUpdate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  subHolder: {
    width: devideWidth - 28,
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
    maxHeight: devideWidth / 1.25,
    width: devideWidth - 28,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 16,
    backgroundColor: colors.fieldHolderBg,
    marginBottom: 25,
    paddingVertical: 5,
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
  errorMessageStyle: {
    backgroundColor: colors.errorbg,
    width: 320,
    padding: 5,
    alignSelf: 'center',
    borderRadius: 5,
  },
  inputFieldStyle: {
    letterSpacing: 8,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  resentOtpStyle: {
    fontSize: 14,
    alignSelf: 'center',
    fontWeight: '500',
  },
  fieldHeaderLineText: {
    alignSelf: 'center',
    color: '#fff',
  },
  errorTextStyle: {
    color: 'rgba(255,255,255,1)',
    fontSize: 11,
    alignSelf: 'center',
  },
  seperatorLineStyle: {
    borderBottomWidth: 1,
    borderColor: '#214674',
    width: '90%',
  },
  textAtBottomofFieldStyle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    alignSelf: 'center',
  },
  resendButtonStyle: {
    padding: 7,
    width: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignSelf: 'center',
    borderRadius: 8,
    marginVertical: 4,
  },
});
