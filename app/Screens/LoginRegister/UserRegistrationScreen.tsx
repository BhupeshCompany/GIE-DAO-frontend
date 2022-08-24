import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useMutation} from '@apollo/client';
import {SEND_PHONE_EMAIL_OTP} from '../../GraphqlOperations/mutation/mutation';
import {Formik} from 'formik';
import * as yup from 'yup';

import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import GradientBackGround from '../../Components/GradientBackGround';
import Input from '../../Components/Input';
import Button from '../../Components/Button';
import {colors} from '../../Styles/theme';
import {passwordRegex} from '../../Utils/regexPattern';
import FieldWarning from '../../Components/FieldWarning';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import CheckBox from '@react-native-community/checkbox';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import { termData } from 'app/Utils/termModelContain';
import ErrorShow from 'app/Components/ErrorShow';
import normalize from 'app/Utils/normalize';
import CountryCodeModal from 'app/Components/CountryCodeModal';

/**constants */
const behaviorForKeyboard = Platform.OS === 'ios' ? 'padding' : 'height';
const deviceWidth = Dimensions.get('screen').width;

const UserRegistrationScreen = ({navigation}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [hidePassword, sethidePassword] = useState<boolean>(true);
  const [hidePasswordConfirm, sethidePasswordConfirm] = useState<boolean>(true);
  const [countryCode, setCountryCode] = useState<string>('+91');
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);
  const [showCountryCodeModal, setShowCountryCodeModal] =
    useState<boolean>(false);

  /**Declearing Object Type for values */
  interface FieldValuesForRegistration {
    userName: string;
    email: string;
    phoneNo: string;
    password: string;
    confirmPassword: string;
  }

  /** send OTP on email and phone on providing valid data */
  const otpToEmailAndPhone = (values: FieldValuesForRegistration) => {
    try {
      sendPhoneEmailOtp({
        variables: {
          resendOTP: false,
          requestType: 'SIGNUP',
          email: values.email,
          countryCode: countryCode,
          phone: values.phoneNo,
        },
      })
        .then(() => {
          navigation.navigate('VerifyOtpScreen', {
            userNameFromRoute: values.userName,
            emailFromRoute: values.email,
            phoneNoFromRoute: values.phoneNo,
            passwordFromRoute: values.password,
            countryCodeFromRoute: countryCode,
          });
          setErrorMessage('');
        })
        .catch(e => {
          setErrorMessage(e.message);
        });
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  const [sendPhoneEmailOtp, {loading}] = useMutation(SEND_PHONE_EMAIL_OTP);

  /**Method to validate all field using yup library */
  const validationSchema = yup.object().shape({
    userName: yup
      .string()
      .min(2, ({min}) => `User name must be ${min} characters`)
      .required('User Name is required'),
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
    phoneNo: yup
      .string()
      .required('Phone number is required')
      .min(10, () => 'Phone Number must be 10 character')
      .max(10, () => 'Phone Number must be 10 character'),
    password: yup
      .string()
      .matches(
        passwordRegex,
        'Password should contain one uppercase ,one lowercase, one numeric value and one special character',
      )
      .min(8, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Password must match')
      .required('Field is required'),
  });

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

  const infoRender = () => {
    return (
      <View>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={require('../../Assets/Png/error.png')}
            style={styles.errorPngStyle}
          />
          <View>
            <Text
              style={[
                styles.infoTextStyle,
                {fontWeight: '700', marginBottom: normalize(4)},
              ]}>
              Create a strong password.
            </Text>
            <Text style={styles.infoTextStyle}>
              Must contain at least 8 -20 characters & 1 special character
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={behaviorForKeyboard}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GradientBackGround>
          <SafeAreaView>
            <View style={[styles.subHolder, {flex: 1}]}>
              <ScrollView style={{flexGrow: 1}} nestedScrollEnabled={true}>
                <HeaderTitleHolder
                  antDesign="login"
                  headerTitle=" New User Registration"
                />
                <Formik
                  validationSchema={validationSchema}
                  initialValues={{
                    userName: '',
                    email: '',
                    phoneNo: '',
                    password: '',
                    confirmPassword: '',
                  }}
                  onSubmit={otpToEmailAndPhone}>
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                  }) => (
                    <>
                      <View style={styles.fieldHolder}>
                        <View
                          style={{
                            height: deviceWidth,
                            justifyContent: 'space-evenly',
                            width: '92%',
                          }}>
                          <Input
                            value={values.userName}
                            onChangeText={handleChange('userName')}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="user" style={styles.iconStyle} />
                            }
                            placeholder="User Name"
                            onBlur={() => {
                              handleBlur('userName');
                            }}
                            errorContainer={
                              errors.userName &&
                              touched.userName && (
                                <FieldWarning title={errors.userName} />
                              )
                            }
                          />
                          <Input
                            value={values.email}
                            onChangeText={handleChange('email')}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="mail" style={styles.iconStyle} />
                            }
                            placeholder="Email ID"
                            onBlur={() => {
                              handleBlur('email');
                            }}
                            errorContainer={
                              errors.email &&
                              touched.email && (
                                <FieldWarning title={errors.email} />
                              )
                            }
                            keyboardType="email-address"
                          />
                          <Input
                            value={values.phoneNo}
                            onChangeText={handleChange('phoneNo')}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <TouchableOpacity
                                style={styles.phoneFieldLeftContainer}
                                onPress={() => {
                                  setShowCountryCodeModal(
                                    !showCountryCodeModal,
                                  );
                                }}>
                                <AntDesign
                                  name="mobile1"
                                  style={styles.iconStyle}
                                />
                                <View style={styles.countryCodeArrowHolder}>
                                  <Text style={{color: '#fff'}}>
                                    {countryCode}
                                  </Text>
                                  <AntDesign
                                    name="caretdown"
                                    style={styles.downArrowStyle}
                                  />
                                </View>
                              </TouchableOpacity>
                            }
                            placeholder="Phone Number"
                            onBlur={() => {
                              handleBlur('phoneNo');
                            }}
                            errorContainer={
                              errors.phoneNo &&
                              touched.phoneNo && (
                                <FieldWarning title={errors.phoneNo} />
                              )
                            }
                            keyboardType="phone-pad"
                          />
                          <Input
                            value={values.password}
                            onChangeText={handleChange('password')}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="lock" style={styles.iconStyle} />
                            }
                            rightContainer={
                              <TouchableOpacity
                                onPress={() => sethidePassword(!hidePassword)}
                                style={{justifyContent: 'center'}}>
                                <Entypo
                                  name={hidePassword ? 'eye' : 'eye-with-line'}
                                  style={{
                                    color: 'rgba(255,255,255,0.5)',
                                    fontSize: 22,
                                  }}
                                />
                              </TouchableOpacity>
                            }
                            placeholder="Password"
                            onBlur={() => {
                              handleBlur('password');
                            }}
                            secureTextEntry={hidePassword}
                            errorContainer={
                              errors.password &&
                              touched.password && (
                                <FieldWarning title={errors.password} />
                              )
                            }
                          />
                          <Input
                            value={values.confirmPassword}
                            onChangeText={handleChange('confirmPassword')}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="lock" style={styles.iconStyle} />
                            }
                            placeholder="Confirm Password"
                            onBlur={() => {
                              handleBlur('confirmPassword');
                            }}
                            rightContainer={
                              <TouchableOpacity
                                onPress={() =>
                                  sethidePasswordConfirm(!hidePasswordConfirm)
                                }
                                style={{justifyContent: 'center'}}>
                                <Entypo
                                  name={
                                    hidePasswordConfirm
                                      ? 'eye'
                                      : 'eye-with-line'
                                  }
                                  style={{
                                    color: 'rgba(255,255,255,0.5)',
                                    fontSize: 22,
                                  }}
                                />
                              </TouchableOpacity>
                            }
                            secureTextEntry={hidePasswordConfirm}
                            errorContainer={
                              errors.confirmPassword &&
                              touched.confirmPassword && (
                                <FieldWarning title={errors.confirmPassword} />
                              )
                            }
                          />
                          <View style={styles.checkBoxHolder}>
                            <CheckBox
                              value={toggleCheckBox}
                              onValueChange={value => setToggleCheckBox(value)}
                              boxType="square"
                              lineWidth={2}
                              onCheckColor="#000"
                              hideBox={true}
                              tintColors={{true: '#fff', false: '#fff'}}
                              style={styles.checkBoxStyle}
                            />
                            <View>
                              <Text style={styles.termsTextStyle}>
                                I Accept Terms and Conditions and Privacy
                                Policy.
                              </Text>
                            </View>
                          </View>
                          {errorMessage ? (
                            <ErrorShow message={errorMessage} />
                          ) : (
                            infoRender()
                          )}
                        </View>
                      </View>
                      <Button
                        lable="Submit"
                        buttonWidth={240}
                        buttonHeight={56}
                        labelStyle={styles.labelStyle}
                        onPress={() => {
                          if (toggleCheckBox) {
                            setErrorMessage('');
                            handleSubmit();
                          } else {
                            setErrorMessage(
                              'Please accept terms and condition !',
                            );
                          }
                        }}
                        showActivityIndicator={loading}
                        buttonStyle={{marginTop: 20, alignSelf: 'center'}}
                      />
                    </>
                  )}
                </Formik>
              </ScrollView>
            </View>
          </SafeAreaView>
          {showTermsModelMethod()}
          {showCountryCodeModal ? (
            <CountryCodeModal
              onPressTile={item => {
                setShowCountryCodeModal(false);
                setCountryCode(item.countryCode);
              }}
            />
          ) : null}
        </GradientBackGround>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default UserRegistrationScreen;

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
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: deviceWidth - 28,
    shadowOffset: {width: 0, height: 4},
    elevation: 1,
    shadowOpacity: 1,
    shadowColor: '#302A2A40',
    shadowRadius: 0,
    backgroundColor: colors.fieldHolderBg,
    padding: 8,
  },
  textInputStyle: {
    width: '100%',
    padding: Platform.OS === 'ios' ? 9 : 0,
    color: '#fff',
    paddingRight: 10,
    paddingLeft: 0,
  },
  labelStyle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  iconStyle: {
    color: colors.white,
    fontSize: 22,
    paddingLeft: 10,
    marginRight: Platform.OS === 'android' ? -18 : -9,
    flex: 2,
    alignSelf: 'center',
  },
  errorText: {
    fontSize: 13,
    color: 'red',
    lineHeight: 14,
    alignSelf: 'flex-start',
    marginLeft: 10,
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
      : {position: 'absolute', left: -5, top: -9},
  termsTextStyle: {
    color: '#fff',
    fontSize: 12,
    textAlignVertical: 'bottom',
    fontWeight: '500',
    marginLeft: Platform.OS === 'ios' ? 6 : 24,
  },
  checkBoxHolder: {
    flexDirection: 'row',
    marginTop: 0,
  },
  wholeFieldStyle: {
    width: '100%'
  },
  textInputField: {
    padding: Platform.OS == 'ios' ? 4 : 7,
  },
  errorPngStyle: {
    width: normalize(15),
    height: normalize(15),
    alignSelf: 'flex-start',
    marginHorizontal: normalize(8),
    marginTop: Platform.OS === 'android' ? normalize(4) : 0,
  },
  infoTextStyle: {
    color: '#fff',
    fontSize: 12,
    width:'99%'
  },
  phoneFieldLeftContainer: {
    flexDirection: 'row',
    width: normalize(110),
    justifyContent: 'space-between',
  },
  countryCodeArrowHolder: {
    flexDirection: 'row',
    width: '60%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingRight: 12,
    borderRightWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  downArrowStyle: {
    color: '#fff',
    fontSize: 12,
    alignSelf: 'center',
  },
});
