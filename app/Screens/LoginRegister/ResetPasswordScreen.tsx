import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useMutation} from '@apollo/client';

import FieldWarning from '../../Components/FieldWarning';
import Button from '../../Components/Button';
import GradientBackGround from '../../Components/GradientBackGround';
import HeaderTitleHolder from '../../Components/HeaderTitleHolder';
import {
  FORGET_PASSWORD,
  SEND_EMAIL_OTP,
} from '../../GraphqlOperations/mutation/mutation';
import Input from '../../Components/Input';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {colors} from '../../Styles/theme';
import QuestionLogo from 'app/Components/QuestionLogo';
import TermsModel from 'app/Components/TermsModel';
import { termData } from 'app/Utils/termModelContain';
import normalize from 'app/Utils/normalize';

//#region regex
const passwordRegex =
  /^.*(?=.{3,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/;
//endregion

const deviceWidth = Dimensions.get('screen').width;

export default function ResetPasswordScreen({navigation, route}) {
  const [email, setEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showTermsModel, setShowTermModel] = useState<boolean>(false);

  const [forgotPassword, {loading}] = useMutation(FORGET_PASSWORD);
  const [resentMailOtp] = useMutation(SEND_EMAIL_OTP);

  useEffect(() => {
    const {emailFromRoute} = route.params;
    setEmail(emailFromRoute);
  }, [route.params]);

  /**Method to validate all data in field using yup library */
  const validationSchema = yup.object().shape({
    newPassword: yup
      .string()
      .matches(
        passwordRegex,
        'Password should contain one uppercase letter, one numeric value and one special character.',
      )
      .min(8, ({min}) => `Password must be at least ${min} characters.`)
      .required('Password is required'),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref('newPassword'), null], 'Password must match.')
      .required('Field is required'),
  });

  /**Declearing Object Type for values */
  interface FieldValuesForPrivateKey {
    mailOtp: string;
    newPassword: string;
    confirmNewPassword: string;
  }

  /** Call on Forget password API*/
  const resetPassword = async (values: FieldValuesForPrivateKey) => {
    try {
      await forgotPassword({
        variables: {
          email: email,
          emailOtp: values.mailOtp,
          password: values.newPassword,
        },
      })
        .then(() => {
          navigation.navigate('UserLoginScreen');
        })
        .catch(error => setErrorMessage(error.message));
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  /**Call on resend OTP via Email */
  const resentMailOtpMethod = async () => {
    try {
      await resentMailOtp({
        variables: {
          resendOTP: true,
          requestType: 'FORGET_PASSWORD',
          email: email,
        },
      });
    } catch (e) {
      setErrorMessage(e.message);
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

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <GradientBackGround>
          <SafeAreaView>
            <View style={[styles.subHolder, {flex: 1}]}>
              <ScrollView>
                <Formik
                  validationSchema={validationSchema}
                  initialValues={{
                    mailOtp: '',
                    newPassword: '',
                    confirmNewPassword: '',
                  }}
                  onSubmit={resetPassword}>
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                  }) => (
                    <>
                      <HeaderTitleHolder
                        antDesign="lock"
                        headerTitle="Reset Password"
                        headerSubTitle="Reset the password by verifying OTP sent to your email."
                      />
                      <View style={[styles.fieldHolder]}>
                        <View
                          style={{
                            height: deviceWidth / 2.7,
                            justifyContent: 'space-around',
                          }}>
                          <Text style={{alignSelf: 'center', color: '#fff'}}>
                            Enter Email OTP
                          </Text>
                          <Input
                            value={values.mailOtp}
                            onChangeText={handleChange('mailOtp')}
                            textStyle={{
                              letterSpacing: 8,
                              fontSize: 16,
                              fontWeight: '500',
                              textAlign: 'center',
                            }}
                            Allstyle={{alignSelf: 'center'}}
                            style={[
                              styles.textInputStyle,
                              {width: 150, alignSelf: 'center'},
                            ]}
                            onBlur={() => {
                              handleBlur('newPassword');
                            }}
                            errorContainer={
                              <View style={{paddingTop: 9}}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: 'rgba(255,255,255,0.5)',alignSelf:"center"
                                  }}>
                                  {`Email sent to ${email} with OTP`}
                                </Text>
                                <TouchableOpacity
                                  style={styles.resendButtonStyle}
                                  onPress={() => {
                                    resentMailOtpMethod();
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 14,
                                      color: 'rgba(255,255,255,1)',
                                      alignSelf: 'center',
                                      fontWeight: '500',
                                    }}>
                                    Resend OTP
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            }
                            keyboardType={'number-pad'}
                            maxLength={6}
                          />
                        </View>

                        <View
                          style={{
                            flexDirection: 'column',
                            marginBottom: 5,
                            justifyContent: 'space-between',
                          }}>
                          <Input
                            value={values.newPassword}
                            onChangeText={handleChange('newPassword')}
                            onBlur={() => {
                              handleBlur('newPassword');
                            }}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="lock" style={styles.iconStyle} />
                            }
                            placeholder="New Password"
                            secureTextEntry={true}
                            errorContainer={
                              errors.newPassword && touched.newPassword ? (
                                <FieldWarning title={errors.newPassword} />
                              ) : (
                                <Text> </Text>
                              )
                            }
                          />
                          <Input
                            value={values.confirmNewPassword}
                            onChangeText={handleChange('confirmNewPassword')}
                            onBlur={() => {
                              handleBlur('confirmNewPassword');
                            }}
                            style={styles.textInputStyle}
                            Allstyle={styles.wholeFieldStyle}
                            textStyle={styles.textInputField}
                            leftContainer={
                              <AntDesign name="lock" style={styles.iconStyle} />
                            }
                            placeholder="Confirm Password"
                            secureTextEntry={true}
                            errorContainer={
                              errors.confirmNewPassword &&
                              touched.confirmNewPassword ? (
                                <FieldWarning
                                  title={errors.confirmNewPassword}
                                />
                              ) : (
                                <Text> </Text>
                              )
                            }
                          />
                        </View>
                        {errorMessage ? (
                          <View
                            style={{
                              backgroundColor: colors.errorbg,
                              width: 315,
                              padding: 4,
                              borderRadius: 5,
                              marginBottom: 5,
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                color: 'rgba(255,255,255,1)',
                                fontSize: 11,
                              }}>
                              {errorMessage}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      <Button
                        lable="Submit"
                        buttonWidth={240}
                        buttonHeight={56}
                        buttonStyle={{alignSelf: 'center'}}
                        labelStyle={styles.labelStyle}
                        onPress={() => {
                          handleSubmit();
                        }}
                        showActivityIndicator={loading}
                      />
                    </>
                  )}
                </Formik>
              </ScrollView>
            </View>
          </SafeAreaView>
          {showTermsModelMethod()}
        </GradientBackGround>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  textInputStyle: {
    width: '100%',
    padding: Platform.OS === 'ios' ? 9 : 0,
    color: '#fff',
    paddingLeft: 0,
  },
  labelStyle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  fieldHolder: {
    borderColor: colors.fieldHolderBorder,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    width: deviceWidth - 28,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 16,
    backgroundColor: colors.fieldHolderBg,
    paddingVertical: 15,
    marginVertical: 25,
  },
  subHolder: {
    width: deviceWidth - 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Platform.OS == 'ios' ? 20 : 90,
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
  wholeFieldStyle: {
    width: deviceWidth - 65,
  },
  textInputField: {
    padding: Platform.OS == 'ios' ? 4 : 7,
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
